import serial
import sqlite3
from datetime import datetime
import time
import re
import threading

# Ports série
arduino_port_env = "/dev/ttyUSB1"           # Température, humidité, pression, altitude
arduino_port_luminosity = "/dev/ttyUSB0"    # Luminosité
arduino_port_rain = "/dev/ttyUSB2"          # Pluie
arduino_port_wind = "/dev/ttyUSB3"          # Vitesse et direction du vent

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
    match = re.match(
        r"Temp:\s*([\d\.]+)\s*C,\s*Hum:\s*([\d\.]+)\s*%,\s*Press:\s*([\d\.]+)\s*hPa,\s*Alt:\s*([\d\.]+)\s*m",
        line
    )
    if match:
        data["temperature"] = float(match.group(1))
        data["humidity"] = float(match.group(2))
        data["pressure"] = float(match.group(3))
        data["altitude"] = float(match.group(4))
    return data

def read_from_arduino_luminosity():
    line = ser_luminosity.readline().decode().strip()
    data = {}
    match = re.match(r"Luminosité:\s*(\d+)", line)
    if match:
        data['luminosity'] = float(match.group(1))
    return data

def read_from_arduino_rain():
    line = ser_rain.readline().decode().strip()
    data = {}
    match = re.match(r"Gouttes detectee:\s*(\d+)", line)
    if match:
        data['rain_height'] = float(match.group(1))
    return data

def read_from_arduino_wind():
    line = ser_wind.readline().decode().strip()
    data = {}
    match = re.match(r"Wind_Speed:\s*([\d\.]+)\s*Km/h,\s*Wind_Direction:\s*(\w+)", line)
    if match:
        data["wind_speed"] = float(match.group(1))
        data["wind_direction"] = match.group(2)
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
        print(f"Erreur lors de l'insertion dans la base de données: {e}")

def read_sensors():
    last_insert_minute = -1
    current_data = {}

    while True:
        now = datetime.now()
        current_minute = now.minute

        # Lecture capteurs
        current_data.update(read_from_arduino_env())
        current_data.update(read_from_arduino_luminosity())
        current_data.update(read_from_arduino_rain())
        current_data.update(read_from_arduino_wind())

        if current_minute != last_insert_minute:
            if current_data:
                insert_into_db(current_data)
            last_insert_minute = current_minute

        time.sleep(1)

if __name__ == "__main__":
    init_db()
    sensor_thread = threading.Thread(target=read_sensors)
    sensor_thread.start()
