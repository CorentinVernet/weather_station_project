// globalWeather.js

// Fonction pour charger les données à partir du fichier JSON
export function loadWeatherData() {
  return fetch("../../data/data.json")
    .then((response) => response.json())
    .then((data) => {
      return {
        temperature: data.temperature, // Température en °C
        windSpeed: data.wind_speed, // Vitesse du vent en km/h
        rainHeight: data.rain_height, // Hauteur de pluie en mm
        windDirection: data.wind_direction, // Direction du vent (en °)
        humidity: data.hygrometrie, // Humidité en %
        pollution: data.polution, // Niveau de pollution
        pressure: data.pressur, // Pression en hPa
      };
    })
    .catch((error) => {
      console.error("Erreur de chargement des données :", error);
    });
}

// Fonction pour déterminer l'état de la météo en fonction des données
export function getWeatherCondition(data) {
  let weatherCondition = "";

  // Si la hauteur de pluie est significative, afficher "Pluvieux"
  if (data.rainHeight > 5) {
    weatherCondition = "Pluvieux";
  }
  // Conditions pour ciel dégagé
  else if (data.temperature > 25 && data.humidity < 60) {
    weatherCondition = "Ensoleillé";
  }
  // Conditions pour nuageux
  else if (
    data.temperature >= 15 &&
    data.temperature <= 25 &&
    data.humidity > 60
  ) {
    weatherCondition = "Nuageux";
  }
  // Conditions pour orageux
  else if (
    data.temperature > 25 &&
    data.humidity > 60 &&
    data.pressure < 1000
  ) {
    weatherCondition = "Orageux";
  }
  // Conditions pour froid
  else if (data.temperature < 10) {
    weatherCondition = "Froid";
  }
  // Si aucune condition spécifique, afficher "Variable"
  else {
    weatherCondition = "Variable";
  }

  return weatherCondition;
}
