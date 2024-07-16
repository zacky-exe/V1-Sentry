from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc
import difflib

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=ZACKY\\SQLEXPRESS;'
        'DATABASE=AdminDB;'
        'Trusted_Connection=yes;'
    )
    return conn

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get('text', '').strip().lower()

    fake_characteristics = [
        "Good to keep family photos and memories in it.", "my second purchase ... Good quality n comfortable ... thanks", 
        "very beautiful soft material .... worth buying .... thanks", "Good quality n comfortable ... thanks", 
        "Fast delivery and great service"
    ]
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT characteristic FROM dbo.FakeCharacteristics")
    db_fake_characteristics = [row[0] for row in cursor.fetchall()]
    conn.close()

    all_fake_characteristics = [keyword.lower() for keyword in (fake_characteristics + db_fake_characteristics)]

    if text in all_fake_characteristics:
        percentage = 100
    else:
        highest_similarity = 0
        for characteristic in all_fake_characteristics:
            similarity = difflib.SequenceMatcher(None, text, characteristic).ratio()
            if similarity > highest_similarity:
                highest_similarity = similarity

        if highest_similarity >= 0.95:
            percentage = 75
        elif highest_similarity >= 0.75:
            percentage = 50
        elif highest_similarity >= 0.5:
            percentage = 25
        else:
            percentage = 0

    if percentage == 100:
        risk_level = "Very High Suspicion !"
        comment = "Avoid it all cost !"
    elif percentage == 75:
        risk_level = "High Suspicion !"
        comment = " Wouldn't recommend to buy."
    elif percentage == 50:
        risk_level = "Medium"
        comment = "The choice is yours."
    elif percentage == 25:
        risk_level = "Low Suspicion"
        comment = "This comment could be legit."
    else:
        risk_level = "No Suspicion Detected"
        comment = "You are safe !"

    return jsonify({'is_fake': percentage > 0, 'percentage': percentage, 'risk_level': risk_level, 'comment': comment})

@app.route('/report-comment', methods=['POST'])
def report_comment():
    data = request.json
    text = data.get('text', '')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO dbo.FakeCharacteristics (Characteristic) VALUES (?)", text)
    conn.commit()
    conn.close()

    return jsonify({'status': 'success'})

@app.route('/report-user', methods=['POST'])
def report_user():
    data = request.json
    text = data.get('text', '')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO dbo.FakeUsers (Username) VALUES (?)", text)
    conn.commit()
    conn.close()

    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
