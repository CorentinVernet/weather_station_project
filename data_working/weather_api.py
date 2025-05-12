from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE = "weather.db"
TABLE = "weather" 

def get_last_non_null_value(field):
    """Récupère la dernière valeur non nulle pour un champ donné."""
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
        "luminosity": get_last_non_null_value("luminosity")

    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
