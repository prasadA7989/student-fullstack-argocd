from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)

DB_HOST = os.environ.get("DB_HOST", "mysql")
DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "root123")
DB_NAME = os.environ.get("DB_NAME", "studentdb")

def get_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/init")
def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            department VARCHAR(100),
            year_joined INT
        )
    """)
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "students table created"})

@app.route("/students", methods=["GET"])
def get_students():
    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM students")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(rows)

@app.route("/students", methods=["POST"])
def add_student():
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO students (name, department, year_joined) VALUES (%s, %s, %s)",
        (data["name"], data["department"], data["year_joined"])
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "student added"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
