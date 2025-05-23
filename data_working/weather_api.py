from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime


app = Flask(__name__)
CORS(app, origins="*")

DATABASE = "weather.db"
TABLE = "weather"

def get_last_non_null_value(field):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT {field} FROM {TABLE}
        WHERE {field} IS NOT NULL
        ORDER BY timestamp DESC
        LIMIT 1
    """)
    result = cursor.fetchone()
    conn.close()
    return result[0] if result else None

@app.route('/api/latest', methods=['GET'])
def get_latest_weather():
    conn = sqlite3.connect(DATABASE)
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

    conn = sqlite3.connect(DATABASE)
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

@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Aucune donnée reçue"}), 400

    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute(f"""
            INSERT INTO {TABLE} (
                timestamp, temperature, humidity, pressure, altitude,
                luminosity, pluie, wind_speed, wind_direction
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            datetime.now().isoformat(),
            data.get("temperature"),
            data.get("humidity"),
            data.get("pressure"),
            data.get("altitude"),
            data.get("luminosity"),
            data.get("pluie"),
            data.get("wind_speed"),
            data.get("wind_direction")
        ))
        conn.commit()
        conn.close()
        return jsonify({"message": "Données insérées avec succès"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
