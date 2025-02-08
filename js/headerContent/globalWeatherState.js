// globalWeatherState.js

export async function loadWeatherData() {
  try {
    const response = await fetch("../../data/data.json"); // Charger le fichier JSON
    if (!response.ok) {
      throw new Error("Impossible de charger les données");
    }
    const data = await response.json(); // Parser le JSON

    // Ne retourner que les données nécessaires pour l'affichage des conditions météo
    return {
      temperature: data.temperature,
      rainHeight: data.rain_height,
      humidity: data.hygrometrie,
      windSpeed: data.wind_speed,
    };
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    return null; // Si l'erreur se produit, retourner null
  }
}

export function getWeatherCondition(data) {
  let weatherCondition = "";

  if (data.rainHeight > 5) {
    weatherCondition = "Pluvieux"; // Pluie importante
  } else if (data.temperature > 25 && data.humidity < 60) {
    weatherCondition = "Ensoleillé"; // Température élevée et faible humidité
  } else if (
    data.temperature >= 15 &&
    data.temperature <= 25 &&
    data.humidity > 60
  ) {
    weatherCondition = "Nuageux"; // Température modérée et humidité élevée
  } else if (data.temperature < 10) {
    weatherCondition = "Froid"; // Température basse
  } else {
    weatherCondition = "Variable"; // Si aucune des conditions ci-dessus n'est remplie
  }

  return weatherCondition; // Retourne l'état de la météo
}
