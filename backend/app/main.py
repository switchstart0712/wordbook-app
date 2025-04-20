from fastapi import FastAPI
# CORSエラーを防ぐため
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# React側のURLを許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ← ReactのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}