from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection

app = FastAPI(title="LifeShield API")
def create_tables():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS checks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            risk_level TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()


create_tables()

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
@app.get("/api/database-test")
def database_test():
    connection = get_connection()
    connection.close()

    return {"message": "LifeShield database connection is working"}


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
        connection = get_connection()

        connection.execute(
            """
            INSERT INTO checks (message, risk_level)
            VALUES (?, ?)
            """,
            (message, "warning"),
        )

        connection.commit()
        connection.close()

        return {
            "risk_level": "warning",
            "message": "This message contains possible warning signs. Be careful before responding or clicking any links.",
            "warning_signs": found_warnings,
        }

    connection = get_connection()

    connection.execute(
        """
        INSERT INTO checks (message, risk_level)
        VALUES (?, ?)
        """,
        (message, "low"),
    )

    connection.commit()
    connection.close()

    return {
        "risk_level": "low",
        "message": "No obvious warning signs were detected. Still stay cautious with unexpected messages.",
        "warning_signs": [],
    }

@app.post("/api/check-url")
def check_url(data: dict):
    url = data.get("url", "").strip()

    if not url:
        return {
            "risk_level": "unknown",
            "message": "Please enter a URL to check.",
            "warning_signs": []
        }

    lower_url = url.lower()

    warning_signs = []

    suspicious_words = [
        "login",
        "verify",
        "account",
        "password",
        "winner",
        "claim",
        "free",
        "urgent"
    ]

    for word in suspicious_words:
        if word in lower_url:
            warning_signs.append(word)

    if "http://" in lower_url:
        warning_signs.append("insecure http connection")

    if "@" in url:
        warning_signs.append("unusual @ symbol")

    if warning_signs:
        return {
            "risk_level": "warning",
            "message": "This URL has some warning signs. Avoid entering passwords, OTPs, or personal information unless you are sure the website is trustworthy.",
            "warning_signs": warning_signs
        }

    return {
        "risk_level": "low",
        "message": "No obvious warning signs were detected in this URL. Still check the website address carefully before sharing personal information.",
        "warning_signs": []
    }