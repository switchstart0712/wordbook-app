from sqlmodel import SQLModel, create_engine, Session

# SQLiteファイル DB初期化設定
DATABASE_URL = "sqlite:///./words.db"
engine = create_engine(DATABASE_URL, echo=True)  # echo=True でSQLログが出る

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    return Session(engine)
