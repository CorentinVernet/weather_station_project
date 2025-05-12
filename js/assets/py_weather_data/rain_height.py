import serial
import time
import re
import os

# Configuration du port série
arduino_port = "com5"  
baud_rate = 9600
ser = serial.Serial(arduino_port, baud_rate, timeout=1)  

# Dernière valeur du compteur
def get_rain_height_from_arduino():
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').strip()  
        match = re.search(r'Gouttes detectee: (\d+)', line)
        if match:
            return int(match.group(1))
    return None 

# Mettre à jour le fichier data.js
def update_data_js(rain_height):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_js_path = os.path.join(script_dir, "..", "data.js")
    
    if not os.path.isfile(data_js_path):
        return

    with open(data_js_path, "r") as file:
        data = file.read()

    data = re.sub(r'(rain_height:\s*)\d+', f'rain_height: {rain_height}', data)

    with open(data_js_path, "w") as file:
        file.write(data)

if __name__ == "__main__":
    try:
        last_rain_height = None

        while True: 
          
            rain_height = get_rain_height_from_arduino()

    
            if rain_height is not None and rain_height != last_rain_height:
             
                update_data_js(rain_height)
                last_rain_height = rain_height 

            time.sleep(0.05)  
    except KeyboardInterrupt:
        pass  
    finally:
        ser.close()
