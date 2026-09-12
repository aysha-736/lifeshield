import sqlite3

DATABASE_PATH = "../database/lifeshield.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection