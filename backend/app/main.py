from fastapi import FastAPI,HTTPException, Depends
# CORSエラーを防ぐため
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlmodel import Session, select
from app.models import Word, WordCreate
from app.database import create_db_and_tables, get_session
from fastapi import Path

app = FastAPI()

# アプリ起動時にDB作成
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

#CORS設定 React側のURLを許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # ローカル開発用
        "https://wordbook-app-pi.vercel.app",  # ← Vercel本番ドメイン
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#エンドポイントの設定 
@app.get("/")
def read_root():
    return {"message": "FastAPI is working!"}

@app.get("/words", response_model=List[Word])
def get_words(session: Session = Depends(get_session)):
    return session.exec(select(Word)).all()

@app.post("/words", response_model=Word)
def create_word(word: WordCreate, session: Session = Depends(get_session)):
    db_word = Word(**word.dict())
    session.add(db_word)
    session.commit()
    session.refresh(db_word)
    return db_word

# 単語の編集
@app.put("/words/{word_id}", response_model=Word)
def update_word(word_id: int, updated_word: WordCreate, session: Session = Depends(get_session)):
    word = session.get(Word, word_id)
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    for field, value in updated_word.dict().items():
        setattr(word, field, value)
    session.add(word)
    session.commit()
    session.refresh(word)
    return word

# 単語の削除
@app.delete("/words/{word_id}")
def delete_word(word_id: int, session: Session = Depends(get_session)):
    word = session.get(Word, word_id)
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    session.delete(word)
    session.commit()
    return {"message": "Word deleted"}

#間違えた回数のカウント
@app.patch("/words/{word_id}/mistake", response_model=Word)
def increment_mistake_count(
    word_id: int = Path(..., description="単語のID"),
    session: Session = Depends(get_session),
):
    word = session.get(Word, word_id)
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")

    word.mistakeCount += 1
    session.add(word)
    session.commit()
    session.refresh(word)
    return word