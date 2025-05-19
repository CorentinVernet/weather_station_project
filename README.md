### weather_station_project

# Station Météo

Ce projet est une station météo connectée qui récupère des données en temps réel (comme la température, la pression atmosphérique, l'humidité, la hauteur de pluie, etc.) via des capteurs connectés à un microcontrôleur (Arduino) et les affiche sur un site web.

Le projet comprend un back-end en Python (Flask) qui sert les données via une API, un front-end en HTML, CSS, et JavaScript pour afficher les informations et un Arduino qui capte les données environnementales.
Fonctionnalités

    Vue en temps réel : La page principale affiche des informations en temps réel sur la température, l'humidité, la pression atmosphérique, la hauteur de pluie, la luminosité, l'altitude et plus encore.

    Historique des données : Une page d'historique permet de consulter les données passées en fonction d'une date spécifique grâce à la base de données.

    Actualisation des données : Les utilisateurs peuvent actualiser manuellement les données ou tout actualiser en un clic.

##

Pour lancer le projet, il faut :

    - Brancher les capteurs sur l'ordinateur et changer les port en fonction des capteurs.

    - Lancer le fichier  `arduino_reader.py`
            - $ python3 arduino_reader.py

    - Lancer le fichier `weather_api.py` (API)
            - $ cd  cd weather_station_project/data_working/
            - $ source venv/bin/activate
            - $ python3 weather_api.py

    - Il faut aussi lancer un serveur pour le site :
        $ python -m http.server 8000

#### Attention ! Il faut changer les adresses IP dans les fichiers :

    - main.js (2x)
    - history.js

#### par celle de l'ordinateur.
