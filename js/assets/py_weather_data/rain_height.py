import serial
import time
import re
import os

# Configuration du port série
arduino_port = "com5"  # Remplacez par le port de votre Arduino (ex: COM3 sous Windows)
baud_rate = 9600
ser = serial.Serial(arduino_port, baud_rate, timeout=1)  # timeout ajouté pour éviter un blocage prolongé

# Fonction pour lire la dernière valeur du compteur
def get_rain_height_from_arduino():
    # Ne pas attendre de manière excessive, lire rapidement les données
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').strip()  # Utilisez strip() pour supprimer les espaces et les caractères de contrôle
        print(f"Ligne lue: '{line}'")  # Affiche la ligne lue pour débogage
        match = re.search(r'Gouttes detectee: (\d+)', line)
        if match:
            return int(match.group(1))
    return None  # Retourne None si rien n'est trouvé

# Fonction pour mettre à jour le fichier data.js
def update_data_js(rain_height):
    # Trouver le répertoire où ce script Python est situé
    script_dir = os.path.dirname(os.path.abspath(__file__))  # Répertoire du script actuel
    data_js_path = os.path.join(script_dir, "js", "assets", "data.js")  # Construire le chemin relatif vers data.js

    # Vérification du répertoire courant
    print(f"Répertoire courant : {os.getcwd()}")
    print(f"Répertoire du script : {script_dir}")
    
    # Vérifier si le fichier existe avant de tenter de l'ouvrir
    if not os.path.isfile(data_js_path):
        print(f"Erreur : le fichier '{data_js_path}' n'existe pas dans le répertoire courant.")
        return

    with open(data_js_path, "r") as file:
        data = file.read()

    # Utilisation d'une expression régulière pour trouver et remplacer la valeur de rain_height
    data = re.sub(r'(rain_height:\s*)\d+', f'rain_height: {rain_height}', data)

    with open(data_js_path, "w") as file:
        file.write(data)

# Programme principal
if __name__ == "__main__":
    try:
        # Initialiser une variable pour suivre la dernière hauteur de pluie
        last_rain_height = None

        while True:  # Boucle infinie pour continuer à lire les données
            # Récupérer la hauteur de pluie depuis l'Arduino
            rain_height = get_rain_height_from_arduino()

            # Si une valeur de pluie a été reçue et qu'elle a changé, mettre à jour le fichier
            if rain_height is not None and rain_height != last_rain_height:
                print(f"Nouvelle hauteur de pluie détectée : {rain_height} gouttes")
                # Mettre à jour le fichier data.js avec la nouvelle valeur
                update_data_js(rain_height)
                last_rain_height = rain_height  # Mettre à jour la hauteur de pluie dernière

            time.sleep(0.05)  # Réduire la pause pour rendre la boucle plus réactive

    except KeyboardInterrupt:
        print("Programme interrompu")
    finally:
        ser.close()
