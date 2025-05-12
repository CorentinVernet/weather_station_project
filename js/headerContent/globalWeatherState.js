import data from "../assets/data.js";

export async function loadWeatherData() {
  try {
    return {
      temperature: data.temperature,
      rainHeight: data.rain_height,
      humidity: data.hygrometrie,
      windSpeed: data.wind_speed,
    };
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    return null;
  }
}

export function getWeatherCondition(data) {
  let weatherCondition = "";
  /*
  // Condition de pluie
  if (data.rainHeight > 5) {
    weatherCondition = "Pluvieux";
  }
  // Condition de temps ensoleillé
  else if (data.temperature > 25 && data.humidity < 60 && data.windSpeed < 15) {
    weatherCondition = "Ensoleillé";
  }
  // Condition de temps nuageux
  else if (
    data.temperature >= 15 &&
    data.temperature <= 25 &&
    data.humidity > 60
  ) {
    weatherCondition = "Nuageux";
  }
  // Condition de froid
  else if (data.temperature < 10) {
    weatherCondition = "Froid";
  }
  // Condition venteuse ou perturbée
  else if (data.windSpeed > 20) {
    weatherCondition = "Venteux";
  }
  // Condition variable ou incertaine
  else if (
    (data.temperature >= 10 && data.temperature <= 15) ||
    (data.humidity >= 40 && data.humidity <= 60)
  ) {
    weatherCondition = "Variable";
  } else {
    weatherCondition = "Modéré";
  }

  return weatherCondition;
  */
  return "maintenance";
}
