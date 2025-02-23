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

  if (data.rainHeight > 5) {
    weatherCondition = "Pluvieux";
  } else if (data.temperature > 25 && data.humidity < 60) {
    weatherCondition = "Ensoleillé";
  } else if (
    data.temperature >= 15 &&
    data.temperature <= 25 &&
    data.humidity > 60
  ) {
    weatherCondition = "Nuageux";
  } else if (data.temperature < 10) {
    weatherCondition = "Froid";
  } else {
    weatherCondition = "Variable";
  }

  return weatherCondition;
}
