from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection
import bcrypt

app = FastAPI(title="LifeShield API")


def create_tables():
    connection = get_connection()

    # Create checks table
    connection.execute("""
        CREATE TABLE IF NOT EXISTS checks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            risk_level TEXT NOT NULL,
            user_id INTEGER,
            check_type TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Add new columns if an older database already exists
    columns = [
        row["name"]
        for row in connection.execute("PRAGMA table_info(checks)").fetchall()
    ]

    if "user_id" not in columns:
        connection.execute(
            "ALTER TABLE checks ADD COLUMN user_id INTEGER"
        )

    if "check_type" not in columns:
        connection.execute(
            "ALTER TABLE checks ADD COLUMN check_type TEXT"
        )

    # Create users table
    connection.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
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

    return {
        "message": "LifeShield database connection is working"
    }


@app.post("/api/check-message")
def check_message(data: dict):
    message = data.get("message", "").strip()
    user_id = data.get("user_id")

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

    risk_level = "warning" if found_warnings else "low"

    if found_warnings:
        result_message = (
            "This message contains possible warning signs. "
            "Be careful before responding or clicking any links."
        )
    else:
        result_message = (
            "No obvious warning signs were detected. "
            "Still stay cautious with unexpected messages."
        )

    connection = get_connection()

    connection.execute(
        """
        INSERT INTO checks (
            message,
            risk_level,
            user_id,
            check_type
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            message,
            risk_level,
            user_id,
            "message",
        ),
    )

    connection.commit()
    connection.close()

    return {
        "risk_level": risk_level,
        "message": result_message,
        "warning_signs": found_warnings,
    }


@app.post("/api/check-url")
def check_url(data: dict):
    url = data.get("url", "").strip()
    user_id = data.get("user_id")

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
        risk_level = "warning"
        result_message = (
            "This URL has some warning signs. Avoid entering passwords, "
            "OTPs, or personal information unless you are sure the website "
            "is trustworthy."
        )
    else:
        risk_level = "low"
        result_message = (
            "No obvious warning signs were detected in this URL. "
            "Still check the website address carefully before sharing "
            "personal information."
        )

    connection = get_connection()

    connection.execute(
        """
        INSERT INTO checks (
            message,
            risk_level,
            user_id,
            check_type
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            url,
            risk_level,
            user_id,
            "url",
        ),
    )

    connection.commit()
    connection.close()

    return {
        "risk_level": risk_level,
        "message": result_message,
        "warning_signs": warning_signs
    }


@app.post("/api/register")
def register_user(data: dict):
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not name or not email or not password:
        return {
            "success": False,
            "message": "Please fill in all fields."
        }

    if len(password) < 6:
        return {
            "success": False,
            "message": "Password must be at least 6 characters long."
        }

    connection = get_connection()

    existing_user = connection.execute(
        "SELECT id FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    if existing_user:
        connection.close()

        return {
            "success": False,
            "message": "An account with this email already exists."
        }

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    connection.execute(
        """
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
        """,
        (
            name,
            email,
            hashed_password
        )
    )

    connection.commit()
    connection.close()

    return {
        "success": True,
        "message": "Account created successfully."
    }


@app.post("/api/login")
def login_user(data: dict):
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not email or not password:
        return {
            "success": False,
            "message": "Please enter your email and password."
        }

    connection = get_connection()

    user = connection.execute(
        """
        SELECT id, name, email, password
        FROM users
        WHERE email = ?
        """,
        (email,)
    ).fetchone()

    connection.close()

    if not user:
        return {
            "success": False,
            "message": "Invalid email or password."
        }

    password_matches = bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"].encode("utf-8")
    )

    if not password_matches:
        return {
            "success": False,
            "message": "Invalid email or password."
        }

    return {
        "success": True,
        "message": "Login successful.",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }


@app.get("/api/dashboard/{user_id}")
def get_dashboard(user_id: int):
    connection = get_connection()

    message_count = connection.execute(
        """
        SELECT COUNT(*) AS count
        FROM checks
        WHERE user_id = ?
        AND check_type = ?
        """,
        (user_id, "message")
    ).fetchone()["count"]

    url_count = connection.execute(
        """
        SELECT COUNT(*) AS count
        FROM checks
        WHERE user_id = ?
        AND check_type = ?
        """,
        (user_id, "url")
    ).fetchone()["count"]

    connection.close()

    return {
        "messages_checked": message_count,
        "urls_checked": url_count
    }