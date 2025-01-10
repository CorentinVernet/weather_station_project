import { updateWindDirection } from "./components/windDirection.js";
import { updateWindSpeed } from "./components/windSpeed.js";
import { updateRainHeight } from "./components/rainHeight.js";
import { updateHygrometrie } from "./components/hygrometrie.js";
import { updatePolution } from "./components/polution.js";
import { updateDateTime } from "./dateTime.js";
import { updateAirPressur } from "./components/air_pressur.js";

async function fetchWeatherData() {
  try {
    const response = await fetch("./data/data.json");
    if (!response.ok) {
      console.log("Erreur lors de la récupération des données");
    }

    const data = await response.json();
    updateWeatherDisplay(data);
  } catch (error) {
    console.error("Erreur:", error);
    displayError(error.message);
  }
}

function updateWeatherDisplay(data) {
  const temperature = data.temperature;
  const windSpeed = data.wind_speed;
  const rain_height = data.rain_height;
  const wind_direction = data.wind_direction;
  const hygrometrie = data.hygrometrie;
  const polution = data.polution;
  const pressur = data.pressur;

  document.getElementById("temperature").innerText = `${temperature} °C`;
  document.getElementById("wind-speed").innerText = `${windSpeed} km/h`;
  document.getElementById("rain_height").innerText = `${rain_height} ml`;
  document.getElementById("hygrometrie").innerText = `${hygrometrie} %`;
  document.getElementById("polution").innerText = `${polution} g`;
  document.getElementById("pressur").innerText = `${pressur} bar`;

  updateWindDirection(wind_direction);
}

fetchWeatherData();
setInterval(fetchWeatherData, 60000);
updateDateTime();
