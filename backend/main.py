from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import schemas
import requests
from bs4 import BeautifulSoup,Tag
from urllib.parse import urlparse
from transformers import GPT2Tokenizer
from sentence_transformers import SentenceTransformer
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType, utility


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"],
)

tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
model = SentenceTransformer('all-MiniLM-L6-v2')
connections.connect("default", host="localhost", port="19530")

def get_css_path(element):
    path = []
    while element.parent is not None and element.name != 'html':
        siblings = element.parent.find_all(element.name, recursive=False)
        if len(siblings) > 1:
            index = siblings.index(element) + 1
            path.insert(0, f"{element.name}-of index-({index})")
        else:
            path.insert(0, element.name)
        element = element.parent
    return ''.join(path) if path else ''    

def process_html(url: str):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove unwanted elements
        for ele in soup(['script', 'style', 'svg', 'nav', 'header', 'footer']):
            ele.decompose()
        
        elements = []
        base_url = urlparse(url).path
        for tag in soup.find_all(['div', 'section', 'article', 'p', 'h1', 'h2', 'h3']):
            if isinstance(tag, Tag):
                path = base_url + get_css_path(tag)
                text = tag.get_text(separator=' ', strip=True)
                elements.append({
                    'content': text,
                    'path': path,
                    'html': str(tag) 
                })
        return elements
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing URL: {str(e)}")
    


def manage_collection():
    # Reuse collection if exists
    if utility.has_collection("html_chunks"):
        utility.drop_collection("html_chunks")
    if not utility.has_collection("html_chunks"):
        fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name="url", dtype=DataType.VARCHAR, max_length=500),
            FieldSchema(name="path", dtype=DataType.VARCHAR, max_length=500),
            FieldSchema(name="html", dtype=DataType.VARCHAR, max_length=65535),
            FieldSchema(name="content", dtype=DataType.VARCHAR, max_length=5000),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=384)
        ]
        schema = CollectionSchema(fields, description="HTML chunks")
        collection = Collection("html_chunks", schema)
        
        index_params = {
            "index_type": "IVF_FLAT",
            "metric_type": "L2", 
            "params": {"nlist": 128}
        }
        collection.create_index("embedding", index_params)
    return collection

@app.post("/search")
async def search(request: schemas.search_request):
    try:
        # Processing HTML Content
        elements = process_html(request.url)
        
        # Generating embeddings for each element
        contents = [e['content'] for e in elements]
        embeddings = model.encode(contents).tolist()
        
        # Initiating Milvus data
        collection = manage_collection()
        data = [
            [request.url] * len(elements),  # URL field
            [e['path'] for e in elements],   # Path field
            [e['html'] for e in elements],   # HTML field
            [e['content'] for e in elements], # Content field
            embeddings                        # Embeddings field
        ]
        collection.insert(data)        
        collection.load()
        
        # Search query
        results = collection.search(
            data=model.encode([request.query]).tolist(),
            anns_field="embedding",
            param={"metric_type": "L2", "params": {"nprobe": 15}},
            limit=15,
            output_fields=["path","html","content"],
            expr=f"url == '{request.url}'", 
            consistency_level="Strong"
        )
        processed = []
        seen_contents = set()
        MAX_DISTANCE = 3.0 
        all_results = []
        for hit in results[0]:
                similarity = max(0, 1 - (hit.distance / MAX_DISTANCE))
                percentage = min(round(similarity * 100), 100)
                
                all_results.append({
                    "html": hit.entity.html,
                    "content": hit.entity.content,
                    "path": hit.entity.path,
                    "match": f"{percentage}%",
                })
        

        all_results.sort(key=lambda x: (-int(x["match"].replace('%',''))))
        
        for result in all_results:
            content_key = result["content"].lower()
            if content_key not in seen_contents:
                should_add = True
                # Skips if too similar content is present
                for existing in processed:
                    if content_key in existing["content"].lower() or \
                       existing["content"].lower() in content_key:
                        should_add = False
                        break
                
                if should_add:
                    processed.append({
                        "html": result["html"],
                        "content": result["content"],
                        "path": result["path"],
                        "match": result["match"]
                    })
                    seen_contents.add(content_key)
                
                if len(processed) >= 10:
                    break
        
        return {"results": processed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))