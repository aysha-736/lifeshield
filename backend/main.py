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