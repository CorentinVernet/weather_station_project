#### weather_station_project

# 🌦️ **Station Météo**

Ce projet est une station météo connectée qui récupère des données en temps réel (comme la température, la pression atmosphérique, l'humidité, la hauteur de pluie, l'altitude, direction du vent, vitesse du vent et la luminosité) via des capteurs connectés à un microcontrôleur (Arduino) et les affiche sur un site web.

Le projet comprend un back-end en Python (Flask) qui sert les données via une API, un front-end en HTML, CSS, et JavaScript pour afficher les informations et un Arduino qui capte les données environnementales.

## 🔧 Technologies utilisées

- 🎛️ **Arduino Mega** – Capteurs environnementaux
- 🎛️ **Esp8266** – Envoi des données à l'API
- 🐍 **Python (Flask)** – Back-end & API REST
- 🖥️ **HTML/CSS/JS** – Interface utilisateur (Front-end)
- 🍓 **Raspberry Pi** – Hébergement local

## 🚀 Fonctionnalitées :

#### 🔴 Vue en temps réel :

La page principale affiche des informations en temps réel sur la température, l'humidité, la pression atmosphérique, la hauteur de pluie, la luminosité, l'altitude, la direction du vent et la vitesse du vent.

#### 📅 Historique des données :

Une page d'historique permet de consulter les données passées en fonction d'une date spécifique grâce à la base de données.

#### 🔁 Actualisation des données :

Les utilisateurs peuvent actualiser manuellement les données ou tout actualiser en un clic.

## ▶️ Lancer le projet :

    - Brancher l'Arduino Mega sur une alimentation.

    - Sur le RaspberryPi, lancer le fichier `weather_api.py` (API) :
                - $ cd  cd weather_station_project/data_working/
                - $ source venv/bin/activate
                - $ python3 weather_api.py

    - Il faut aussi lancer un serveur pour le site :
        $ python -m http.server 8000

### 📌 Pour envoyer des codes arduino dans l'Arduino Mega ou l'ESP :

#### PC --> Mega :

    | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   |
    | --- | --- | --- | --- | --- | --- | --- | --- |
    | off | off | on  | on  | on  | on  | off | off |

#### PC --> ESP8266 :

    | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   |
    | --- | --- | --- | --- | --- | --- | --- | --- |
    | off | off | off | off | on  | on  | on  | off |

#### Mega <--> ESP8266 (Etat normal quand programme lancé):

    | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   |
    | --- | --- | --- | --- | --- | --- | --- | --- |
    | on  | on  | off | off | off | off | off | off |

## 📝 Auteurs / Contributions

- 👨‍💻 **Corentin Vernet** – Développement principal, conception et intégration
- 👥 **Classe de 1ère Pro CIEL** – Contributions ponctuelles
- 👨‍🏫 **Mr Longet** / **Mr Dumand** – Accompagnement technique et pédagogique, encadrement et conseils sur le projet
