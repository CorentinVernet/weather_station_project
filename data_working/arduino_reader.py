import serial
import sqlite3
from datetime import datetime
import time
import re
import threading

# Ports série
arduino_port_env = "/dev/ttyUSB1"
arduino_port_luminosity = "/dev/ttyUSB0"
arduino_port_rain = "/dev/ttyUSB2"
arduino_port_wind = "/dev/ttyUSB3"

baud_rate = 9600

# Connexions série
ser_env = serial.Serial(arduino_port_env, baud_rate, timeout=0.1)
ser_luminosity = serial.Serial(arduino_port_luminosity, baud_rate, timeout=0.1)
ser_rain = serial.Serial(arduino_port_rain, baud_rate, timeout=0.1)
ser_wind = serial.Serial(arduino_port_wind, baud_rate, timeout=0.1)

# Base de données
db_path = "weather.db"

def init_db():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS weather (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            temperature REAL,
            humidity REAL,
            pressure REAL,
            rain_height REAL,
            luminosity REAL,
            altitude REAL,
            wind_speed REAL,
            wind_direction TEXT
        )
    """)
    conn.commit()
    conn.close()

def read_from_arduino_env():
    line = ser_env.readline().decode().strip()
    data = {}
    if line:
        print(f"[ENV] Ligne reçue : {line}")
    match = re.match(
        r"Temp:\s*([\d\.]+)\s*C,\s*Hum:\s*([\d\.]+)\s*%,\s*Press:\s*([\d\.]+)\s*hPa,\s*Alt:\s*([\d\.]+)\s*m",
        line
    )
    if match:
        data["temperature"] = float(match.group(1))
        data["humidity"] = float(match.group(2))
        data["pressure"] = float(match.group(3))
        data["altitude"] = float(match.group(4))
        print(f"[ENV] Température={data['temperature']}°C, Humidité={data['humidity']}%, Pression={data['pressure']} hPa, Altitude={data['altitude']} m")
    return data

def read_from_arduino_luminosity():
    line = ser_luminosity.readline().decode().strip()
    data = {}
    if line:
        print(f"[LUM] Ligne reçue : {line}")
    match = re.match(r"Luminosité:\s*(\d+)", line)
    if match:
        data['luminosity'] = float(match.group(1))
        print(f"[LUM] Luminosité = {data['luminosity']}")
    return data

def read_from_arduino_rain():
    line = ser_rain.readline().decode().strip()
    data = {}
    if line:
        print(f"[PLUIE] Ligne reçue : {line}")
    match = re.match(r"Gouttes detectee:\s*(\d+)", line)
    if match:
        data['rain_height'] = float(match.group(1))
        print(f"[PLUIE] Hauteur de pluie = {data['rain_height']}")
    return data

def read_from_arduino_wind():
    data = {}
    wind_speed = None
    wind_direction = None

    # Lire jusqu'à 5 lignes pour trouver à la fois la vitesse et la direction
    for _ in range(5):
        line = ser_wind.readline().decode().strip()
        if not line:
            continue

        print(f"[VENT] Ligne reçue : {line}")

        # Détection de la vitesse du vent
        match_speed = re.match(r"Vitesse du vent en Km/h\s*:\s*([\d\.]+)", line)
        if match_speed:
            wind_speed = float(match_speed.group(1))
            print(f"[VENT] Vitesse = {wind_speed} Km/h")

        # Détection de la direction du vent
        match_dir = re.match(r"Direction:\s*(\w+)", line)
        if match_dir:
            wind_direction = match_dir.group(1)
            print(f"[VENT] Direction = {wind_direction}")

        # Dès qu'on a les deux, on sort
        if wind_speed is not None and wind_direction is not None:
            break

    if wind_speed is not None:
        data["wind_speed"] = wind_speed
    if wind_direction is not None:
        data["wind_direction"] = wind_direction

    return data

def insert_into_db(data):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        mapped_data = {
            "temperature": data.get("temperature"),
            "humidity": data.get("humidity"),
            "pressure": data.get("pressure"),
            "rain_height": data.get("rain_height"),
            "luminosity": data.get("luminosity"),
            "altitude": data.get("altitude"),
            "wind_speed": data.get("wind_speed"),
            "wind_direction": data.get("wind_direction")
        }

        print(f"[DB] Insertion : {mapped_data}")

        cursor.execute("""
            INSERT INTO weather (
                timestamp, temperature, humidity, pressure, rain_height,
                luminosity, altitude, wind_speed, wind_direction
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            datetime.now().isoformat(),
            mapped_data["temperature"],
            mapped_data["humidity"],
            mapped_data["pressure"],
            mapped_data["rain_height"],
            mapped_data["luminosity"],
            mapped_data["altitude"],
            mapped_data["wind_speed"],
            mapped_data["wind_direction"]
        ))

        conn.commit()
        conn.close()

    except Exception as e:
        print(f"[ERREUR DB] {e}")

def read_sensors():
    last_insert_minute = -1
    current_data = {}

    while True:
        now = datetime.now()
        current_minute = now.minute

        # Lecture des capteurs
        env = read_from_arduino_env()
        lum = read_from_arduino_luminosity()
        rain = read_from_arduino_rain()
        wind = read_from_arduino_wind()

        # Mise à jour uniquement des champs non nuls
        current_data.update({k: v for k, v in env.items() if v is not None})
        current_data.update({k: v for k, v in lum.items() if v is not None})
        current_data.update({k: v for k, v in rain.items() if v is not None})
        current_data.update({k: v for k, v in wind.items() if v is not None})

        # Insertion une fois par minute
        if current_minute != last_insert_minute:
            if any(value is not None for value in current_data.values()):
                insert_into_db(current_data)
            last_insert_minute = current_minute

        time.sleep(1)


if __name__ == "__main__":
    print("[SYSTEME] Initialisation de la base de données...")
    init_db()
    print("[SYSTEME] Démarrage du thread de lecture des capteurs...")
    sensor_thread = threading.Thread(target=read_sensors)
    sensor_thread.start()
