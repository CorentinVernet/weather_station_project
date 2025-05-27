import serial
import sqlite3
from datetime import datetime
import time
import re
import threading

arduino_port = "/dev/ttyUSB0"
baud_rate = 9600
ser = serial.Serial(arduino_port, baud_rate, timeout=1)

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

def parse_line(line):
    data = {}

    if "[ENVIRONNEMENT]" in line:
        match = re.search(
            r"Temp:\s*([\d\.]+)\s*°C,\s*Hum:\s*([\d\.]+)\s*%,\s*Press:\s*([\d\.]+)\s*hPa,\s*Alt:\s*([\d\.]+)\s*m",
            line
        )
        if match:
            data["temperature"] = float(match.group(1))
            data["humidity"] = float(match.group(2))
            data["pressure"] = float(match.group(3))
            data["altitude"] = float(match.group(4))
            print(f"[ENV] {data}")

    elif "[LUMINOSITE]" in line:
        match = re.search(r"\[LUMINOSITE\]\s*([\d\.]+)\s*lux", line)
        if match:
            data["luminosity"] = float(match.group(1))
            print(f"[LUM] {data}")

    elif "[PLUIE]" in line:
        match = re.search(r"Total gouttes:\s*(\d+)", line)
        if match:
            gouttes = int(match.group(1))
            volume = gouttes * 23.3  # ml
            data["rain_height"] = volume
            print(f"[PLUIE] {data}")

    elif "[VENT]" in line:
        match = re.search(r"Vitesse:\s*([\d\.]+)\s*km/h,\s*Direction:\s*(\w+)", line)
        if match:
            data["wind_speed"] = float(match.group(1))
            data["wind_direction"] = match.group(2)
            print(f"[VENT] {data}")

    return data

def insert_into_db(data):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO weather (
                timestamp, temperature, humidity, pressure, rain_height,
                luminosity, altitude, wind_speed, wind_direction
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            datetime.now().isoformat(),
            data.get("temperature"),
            data.get("humidity"),
            data.get("pressure"),
            data.get("rain_height"),
            data.get("luminosity"),
            data.get("altitude"),
            data.get("wind_speed"),
            data.get("wind_direction")
        ))

        conn.commit()
        conn.close()
        print(f"[DB] Insertion OK : {data}")

    except Exception as e:
        print(f"[ERREUR DB] {e}")

def read_serial():
    buffer = {}
    last_minute = -1

    while True:
        try:
            line = ser.readline().decode(errors='ignore').strip()
            if line:
                print(f"[SERIAL] {line}")
                new_data = parse_line(line)
                buffer.update(new_data)

                now = datetime.now()
                current_minute = now.minute

                if current_minute != last_minute:
                    if any(buffer.values()):
                        insert_into_db(buffer)
                    buffer.clear()
                    last_minute = current_minute

        except Exception as e:
            print(f"[ERREUR LECTURE] {e}")

if __name__ == "__main__":
    print("[SYSTEME] Initialisation de la base de données...")
    init_db()
    print("[SYSTEME] Démarrage de la lecture série...")
    serial_thread = threading.Thread(target=read_serial)
    serial_thread.start()
