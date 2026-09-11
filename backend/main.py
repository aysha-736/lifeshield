from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="LifeShield API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "LifeShield API is running"}


@app.post("/api/check-message")
def check_message(data: dict):
    message = data.get("message", "").strip()

    if not message:
        return {
            "risk_level": "unknown",
            "message": "Please enter a message to check."
        }

    lower_message = message.lower()

    warning_words = [
        "urgent",
        "click",
        "winner",
        "verify",
        "password",
        "otp",
        "account suspended",
    ]

    found_warnings = [
        word for word in warning_words
        if word in lower_message
    ]

    if found_warnings:
        return {
            "risk_level": "warning",
            "message": "This message contains possible warning signs. Be careful before responding or clicking any links.",
            "warning_signs": found_warnings,
        }

    return {
        "risk_level": "low",
        "message": "No obvious warning signs were detected. Still stay cautious with unexpected messages.",
        "warning_signs": [],
    }