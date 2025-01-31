import {
  loadWeatherData,
  getWeatherCondition,
} from "./headerContent/globalWeather.js";
import { updateWindDirection } from "./components/windDirection.js";
import { updateWindSpeed } from "./components/windSpeed.js";
import { updateRainHeight } from "./components/rainHeight.js";
import { updateHygrometrie } from "./components/hygrometrie.js";
import { updatePolution } from "./components/polution.js";
import { updateDateTime } from "./dateTime.js";
import { updateAirPressur } from "./components/air_pressur.js";

async function updateWeatherDisplay() {
  try {
    const data = await loadWeatherData();

    const weatherCondition = getWeatherCondition(data);

    document.getElementById("global-weather-text").innerText = weatherCondition;

    document.getElementById("temperature").innerText = `${data.temperature} °C`;
    document.getElementById("wind-speed").innerText = `${data.windSpeed} km/h`;
    document.getElementById("rain_height").innerText = `${data.rainHeight} mm`;
    document.getElementById(
      "wind_direction"
    ).innerText = `${data.windDirection}°`;
    document.getElementById("hygrometrie").innerText = `${data.humidity} %`;
    document.getElementById("polution").innerText = `${data.pollution} µg/m³`;
    document.getElementById("pressur").innerText = `${data.pressure} hPa`;

    updateWindDirection(data.windDirection);
  } catch (error) {
    console.error("Erreur lors de l'affichage des données météo :", error);
  }
}

updateWeatherDisplay();

setInterval(updateWeatherDisplay, 60000);
updateDateTime();
