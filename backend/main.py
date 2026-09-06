from fastapi import FastAPI

app = FastAPI(title="LifeShield API")

@app.get("/")
def read_root():
    return {"message": "LifeShield API is running"}