from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.endpoints.files import router as files
from api.endpoints.chat import router as chat

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(files, prefix="/files")
app.include_router(chat, prefix="/chat")


@app.get("/")
async def root():
    return {"mensagem": "API online e operante!"}
