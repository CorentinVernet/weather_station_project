from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

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
    result = {
        "temperature": get_last_non_null_value("temperature"),
        "humidity": get_last_non_null_value("humidity"),
        "pressure": get_last_non_null_value("pressure"),
        "rain_height": get_last_non_null_value("rain_height"),
        "luminosity": get_last_non_null_value("luminosity"),
        "altitude": get_last_non_null_value("altitude"),
        "wind_speed": get_last_non_null_value("wind_speed"),
        "wind_direction": get_last_non_null_value("wind_direction")
    }
    return jsonify(result)

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

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
