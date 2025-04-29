from fastapi import FastAPI,HTTPException
# CORSエラーを防ぐため
from fastapi.middleware.cors import CORSMiddleware

from typing import List
from app.models import Word, WordCreate

app = FastAPI()

#CORS設定 React側のURLを許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ← ReactのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#エンドポイントの設定 
@app.get("/")
def read_root():
    return {"message": "FastAPI is working!"}

# 仮のデータベース(インメモリ)
words_db: List[Word] = []
next_id = 1


@app.get("/words", response_model=List[Word])
def get_words():
    return words_db

@app.post("/words", response_model=Word)
def create_word(word: WordCreate):
    global next_id
    # >>> id: word11 id: word2 グローバルなIDカウンタでユニークID管理
    # print(dict)であれば{key1: value1, key2: value2}となり、**word.dict()では展開が行われている
    new_word = Word(id=next_id, **word.dict())
    words_db.append(new_word)
    next_id += 1
    return new_word