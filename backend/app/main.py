from fastapi import FastAPI
# CORSエラーを防ぐため
from fastapi.middleware.cors import CORSMiddleware

from typing import List
from models import Word, WordCreate

app = FastAPI()

# React側のURLを許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ← ReactのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

words_db: List[Word] = []
next_id = 1

@app.post("/words", response_model=Word)
def create_word(word: WordCreate):
    global next_id
    new_word = Word(id=next_id, **word.dict())
    words_db.append(new_word)
    next_id += 1
    return new word

@app.get("/words", response_model=List[Word])
def get_words():
    return words_db
