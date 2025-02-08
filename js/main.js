import { airPressurValue } from "./components/airPressur.js";
import { temperatureValue } from "./components/temperature.js";
import { windSpeedValue } from "./components/windSpeed.js";
import { rainHeightValue } from "./components/rainHeight.js";
import { hygrometrieValue } from "./components/hygrometrie.js";
import { polutionValue } from "./components/polution.js";
import { windDirectionValue } from "./components/windDirection.js";
import { loadWeatherData } from "./headerContent/globalWeatherState.js";
import { getWeatherCondition } from "./headerContent/globalWeatherState.js";
import { updateDateTime } from "./dateTime.js";
import { showCalendar } from "./headerContent/calendar.js";

async function updateWeatherDisplay() {
  try {
    const airPressur = await airPressurValue();
    document.getElementById("pressur").innerText = airPressur;

    const temperature = await temperatureValue();
    document.getElementById("temperature").innerText = temperature;

    const windSpeed = await windSpeedValue();
    document.getElementById("wind-speed").innerText = windSpeed;

    const rainHeight = await rainHeightValue();
    document.getElementById("rain_height").innerText = rainHeight;

    const hygrometrie = await hygrometrieValue();
    document.getElementById("hygrometrie").innerText = hygrometrie;

    const polution = await polutionValue();
    document.getElementById("polution").innerText = polution;

    const windDirection = await windDirectionValue();
    document.getElementById("windDirection").innerText = windDirection;

    const weatherData = await loadWeatherData();

    if (!weatherData) {
      throw new Error("Les données météo sont manquantes.");
    }

    const weatherCondition = getWeatherCondition(weatherData);
    document.getElementById(
      "global-weather-text"
    ).innerText = ` ${weatherCondition}`;
  } catch (error) {
    console.error("Erreur lors de la mise à jour des données météo :", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateWeatherDisplay();
  updateDateTime();
  setInterval(updateWeatherDisplay, 60000);
  showCalendar();
});
