# Web Query Extractor 🔍

[![Frontend Deployment](https://img.shields.io/badge/Vercel-Deployed-success)](https://your-vercel-app.vercel.app)
[![Backend Deployment](https://img.shields.io/badge/Render-Deployed-blue)](https://your-backend.onrender.com)

A full-stack single-page application (SPA) that allows users to input a website URL and a search query. The application returns the top 10 relevant HTML content chunks (up to 500 tokens each) using semantic or keyword-based search powered by a vector database.

## Key Features ✨

- **🔗 URL Input & Search Query Form**

  Users can provide any website URL and search for relevant content.

- **🧹 HTML Parsing & Cleaning:**

  Extract and clean HTML using BeautifulSoup

- **🧠 Tokenization**

  Break content into chunks (max 500 tokens each) for efficient indexing and search.

- **📦 Vector Search**

  Store content in a vector database and perform fast, accurate semantic retrieval.

- **🏆 Top 10 Matches:**

  Display the most relevant HTML content chunks based on the search query.

## Tech Stack 🛠️

**Frontend**  
[![Next.js](https://img.shields.io/badge/Next.js-14.0-blue?logo=next.js)](https://nextjs.org/)

**Backend**  
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?logo=docker)](https://docker.com)

**Vector Database**
[![Milvus](https://img.shields.io/badge/Milvus-2.3.3-00B5AD?logo=data:image/svg+xml;base64,PHN2Zy...)](https://milvus.io)
[![pymilvus](https://img.shields.io/badge/PyMilvus-2.3.3-3776AB?logo=python)](https://pymilvus.readthedocs.io/)

**NLP**  
[![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-FFD21F?logo=huggingface)](https://huggingface.co)
[![BERT](https://img.shields.io/badge/BERT-Sentiment%20Analysis-FF6F00)](https://huggingface.co/docs/transformers/model_doc/bert)

## Setup Instructions ⚙️

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker 24+
- Pip latest 25.0+

### Local Development

1. **Clone Repository**

   ```bash
   git clone https://github.com/jkchinnu-525/Web-Search.git

   ```

2. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**

   ```bash
   cd backend
   pip install
   uvicorn main:app --reload
   ```

4. **Run With Docker**
   ```bash
   docker compose up
   ```
