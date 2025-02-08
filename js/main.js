// Importer les fichiers des composants et de l'état global
import { airPressurValue } from "./components/airPressur.js";
import { temperatureValue } from "./components/temperature.js";
import { windSpeedValue } from "./components/windSpeed.js";
import { rainHeightValue } from "./components/rainHeight.js";
import { hygrometrieValue } from "./components/hygrometrie.js";
import { polutionValue } from "./components/polution.js";
import { windDirectionValue } from "./components/windDirection.js";

// Fonction pour mettre à jour l'interface utilisateur avec les données calculées
async function updateWeatherDisplay() {
  try {
    // Récupérer les valeurs calculées et formatées depuis les composants
    const airPressur = await airPressurValue(); // Exemple : "3 bar"
    document.getElementById("pressur").innerText = airPressur;

    const temperature = await temperatureValue(); // Exemple : "25 °C"
    document.getElementById("temperature").innerText = temperature;

    const windSpeed = await windSpeedValue(); // Exemple : "12 km/h"
    document.getElementById("wind-speed").innerText = windSpeed;

    const rainHeight = await rainHeightValue(); // Exemple : "2 mm"
    document.getElementById("rain_height").innerText = rainHeight;

    const hygrometrie = await hygrometrieValue(); // Exemple : "65 %"
    document.getElementById("hygrometrie").innerText = hygrometrie;

    const polution = await polutionValue(); // Exemple : "25 µg/m³"
    document.getElementById("polution").innerText = polution;

    const windDirection = await windDirectionValue(); // Exemple : "Nord"
    document.getElementById("windDirection").innerText = windDirection;
  } catch (error) {
    console.error("Erreur lors de la mise à jour des données météo :", error);
  }
}

// Exécution initiale pour charger et afficher les données météo
updateWeatherDisplay();

// Mettre à jour les données toutes les 60 secondes (60 000 ms)
setInterval(updateWeatherDisplay, 60000);
