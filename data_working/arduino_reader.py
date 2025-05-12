import serial
import sqlite3
from datetime import datetime
import time
import re
import threading

arduino_port_temp_pressure = "COM5"
arduino_port_rain_height = "COM6"
arduino_port_luminosity = "COM9" 

baud_rate = 9600

ser_temp_pressure = serial.Serial(arduino_port_temp_pressure, baud_rate, timeout=1)
ser_rain_height = serial.Serial(arduino_port_rain_height, baud_rate, timeout=1)
ser_luminosity = serial.Serial(arduino_port_luminosity, baud_rate, timeout=1)

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
            luminosity REAL
        )
    """)
    conn.commit()
    conn.close()

def read_from_arduino_temp_pressure():
    line = ser_temp_pressure.readline().decode().strip()
    data = {}
    match = re.match(r"Temp:\s*([\d\.]+)\s*C,\s*Press:\s*([\d\.]+)\s*hPa", line)
    if match:
        data['temperature'] = float(match.group(1))
        data['pressure'] = float(match.group(2))
    return data

def read_from_arduino_rain_height():
    line = ser_rain_height.readline().decode().strip()
    data = {}
    match = re.match(r"Gouttes detectee:\s*(\d+)", line)
    if match:
        data['rain_height'] = float(match.group(1))
    return data

def read_from_arduino_luminosity():
    line = ser_luminosity.readline().decode().strip()

    data = {}
    match = re.match(r"Luminosité:\s*(\d+)", line) 
    
    if match:
        luminosity = float(match.group(1))  
        data['luminosity'] = luminosity

    return data

def insert_into_db(data):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    mapped_data = {
        "temperature": data.get("temperature"),
        "humidity": data.get("humidity"),
        "pressure": data.get("pressure"),
        "rain_height": data.get("rain_height"),
        "luminosity": data.get("luminosity")
    }


    cursor.execute("""
        INSERT INTO weather (timestamp, temperature, humidity, pressure, rain_height, luminosity)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        datetime.now().isoformat(),
        mapped_data["temperature"],
        mapped_data["humidity"],
        mapped_data["pressure"],
        mapped_data["rain_height"],
        mapped_data["luminosity"]
    ))

    conn.commit()
    conn.close()


def read_sensors():
    while True:
        combined_data = {}

        temp_pressure_data = read_from_arduino_temp_pressure()
        combined_data.update(temp_pressure_data)

        rain_height_data = read_from_arduino_rain_height()
        combined_data.update(rain_height_data)

        luminosity_data = read_from_arduino_luminosity()
        combined_data.update(luminosity_data)

        if combined_data:
            insert_into_db(combined_data)

        time.sleep(1)

if __name__ == "__main__":
    init_db()
    sensor_thread = threading.Thread(target=read_sensors)
    sensor_thread.start()
