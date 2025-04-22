from pydantic import BaseModel
from typing import List

class Word(BaseModel):
    id: int
    word: str
    meaning: str

class WordCreate(BaseModel):
    word: str
    meaning: str


