from fastapi import FastAPI

app = FastAPI()

@app.get('/ola')
async def root():
  return {"message": "olá"}
