from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app, origins="*")

DATABASE = "/home/pi/weather_station_project/data_working/weather.db"
TABLE = "weather"

def connect_db():
    return sqlite3.connect(DATABASE)

@app.route('/api/latest', methods=['GET'])
def get_latest_weather():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT * FROM {TABLE}
        ORDER BY timestamp DESC
        LIMIT 1
    """)
    row = cursor.fetchone()
    keys = [description[0] for description in cursor.description]
    conn.close()

    if not row:
        return jsonify({key: None for key in keys})
    return jsonify(dict(zip(keys, row)))

@app.route('/api/history', methods=['GET'])
def get_weather_history():
    date = request.args.get('date')
    if not date:
        return jsonify({"error": "Date manquante"}), 400

    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT * FROM {TABLE}
        WHERE DATE(timestamp) = ?
        ORDER BY timestamp ASC
    """, (date,))
    
    rows = cursor.fetchall()
    keys = [description[0] for description in cursor.description]
    conn.close()

    results = [dict(zip(keys, row)) for row in rows]
    return jsonify(results)

@app.route('/api/data', methods=['GET', 'POST'])
def recevoir_ou_lire_donnees():
    if request.method == 'POST':
        data = request.get_json()
        conn = connect_db()
        cursor = conn.cursor()

        cursor.execute(f"""
            INSERT INTO {TABLE} (
                timestamp, temperature, humidity, pressure,
                altitude, luminosity, rain_height, wind_speed, wind_direction
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            datetime.now().isoformat(),
            data.get("temperature"),
            data.get("humidity"),
            data.get("pressure"),
            data.get("altitude"),
            data.get("luminosity"),
            data.get("rain_height"),
            data.get("wind_speed"),
            data.get("wind_direction")
        ))

        conn.commit()
        conn.close()
        return jsonify({'message': 'Données insérées avec succès'})

    elif request.method == 'GET':
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {TABLE} ORDER BY timestamp DESC LIMIT 10")
        rows = cursor.fetchall()
        keys = [description[0] for description in cursor.description]
        conn.close()

        return jsonify([dict(zip(keys, row)) for row in rows])

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
