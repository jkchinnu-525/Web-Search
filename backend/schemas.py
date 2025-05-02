from pydantic import BaseModel
from typing import List
class search_request(BaseModel):
    url: str
    query: str