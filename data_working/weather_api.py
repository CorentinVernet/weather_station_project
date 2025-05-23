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

@app.route('/api/data', methods=['GET', 'POST'])
def recevoir_ou_lire_donnees():
    if request.method == 'POST':
        # insérer les données comme tu le fais déjà
        ...
        return jsonify({'message': 'Données insérées avec succès'})
    
    elif request.method == 'GET':
        # lire les données depuis la base et les retourner
        conn = sqlite3.connect('meteo.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM weather ORDER BY timestamp DESC LIMIT 10")
        lignes = cursor.fetchall()
        conn.close()

        # transformer en JSON
        resultats = []
        for ligne in lignes:
            resultats.append({
                'timestamp': ligne[0],
                'temperature': ligne[1],
                'humidity': ligne[2],
                'pressure': ligne[3],
                'altitude': ligne[4],
                'luminosity': ligne[5],
                'pluie': ligne[6],
                'wind_speed': ligne[7],
                'wind_direction': ligne[8],
            })

        return jsonify(resultats)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
