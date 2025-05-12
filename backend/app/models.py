from sqlmodel import SQLModel, Field
from typing import Optional

class WordBase(SQLModel):
    word: str
    meaning: str
    memo: Optional[str] = ""
    mistakeCount: int = 0

class Word(WordBase, table=True):  # DBテーブルになるモデル
    id: Optional[int] = Field(default=None, primary_key=True)

class WordCreate(WordBase):  # 登録専用モデル（idなし）
    pass
