import { updateDateTime } from "./headerContent/dateTime.js";
import { showCalendar } from "./headerContent/calendar.js";
import { getWeatherCondition } from "./headerContent/globalWeatherState.js";

function updateGlobalWeatherDisplay(data) {
  const condition = getWeatherCondition(data);
  const textElement = document.getElementById("global-weather-text");

  const emojiMap = {
    Ensoleillé: "☀️",
    Pluvieux: "🌧️",
    "Fortement pluvieux": "⛈️",
    Nuageux: "☁️",
    Orageux: "🌩️",
    Froid: "❄️",
    Venteux: "💨",
    Variable: "🌤️",
    Modéré: "🌥️",
  };

  const emoji = emojiMap[condition] || "🌡️";
  textElement.textContent = `${emoji} ${condition}`;
}

async function fetchLatestData() {
  try {
    const response = await fetch(
      "http://${window.location.hostname}:5000/api/latest"
    ); //Adresse ip du Raspberry pi (local wifi)
    const data = await response.json();
    console.log("Données reçues de l'API:", data);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données météo :", error);
    return {};
  }
}

window.updateTemperature = async function () {
  const data = await fetchLatestData();
  document.getElementById("temperature").innerText =
    data.temperature !== null ? `${data.temperature} °C` : "--";
};

window.updateHumidity = async function () {
  const data = await fetchLatestData();
  document.getElementById("hygrometrie").innerText =
    data.humidity !== null ? `${data.humidity} %` : "--";
};

window.updatePressure = async function () {
  const data = await fetchLatestData();
  document.getElementById("pressur").innerText =
    data.pressure !== null ? `${data.pressure} hPa` : "--";
};

window.updateRain = async function () {
  const data = await fetchLatestData();
  document.getElementById("rain_height").innerText =
    data.rain_height !== null ? `${data.rain_height} ml` : "--";
};

window.updateLuminosity = async function () {
  const data = await fetchLatestData();
  document.getElementById("luminosity").innerText =
    data.luminosity !== null ? `${data.luminosity} lux` : "--";
};

window.updateAltitude = async function () {
  const data = await fetchLatestData();
  document.getElementById("altitude").innerText =
    data.altitude !== null ? `${data.altitude} m` : "--";
};

window.updateWindSpeed = async function () {
  const data = await fetchLatestData();
  document.getElementById("wind_speed").innerText =
    data.wind_speed !== null ? `${data.wind_speed} km/h` : "--";
};

window.updateWindDirection = async function () {
  const data = await fetchLatestData();
  document.getElementById("wind_direction").innerText =
    data.wind_direction !== null ? data.wind_direction : "--";
};

window.updateAll = async function () {
  const data = await fetchLatestData();

  document.getElementById("temperature").innerText =
    data.temperature !== null ? `${data.temperature} °C` : "--";
  document.getElementById("hygrometrie").innerText =
    data.humidity !== null ? `${data.humidity} %` : "--";
  document.getElementById("pressur").innerText =
    data.pressure !== null ? `${data.pressure} hPa` : "--";
  document.getElementById("rain_height").innerText =
    data.rain_height !== null ? `${data.rain_height} ml` : "--";
  document.getElementById("luminosity").innerText =
    data.luminosity !== null ? `${data.luminosity} lux` : "--";
  document.getElementById("altitude").innerText =
    data.altitude !== null ? `${data.altitude} m` : "--";

  document.getElementById("wind_speed").innerText =
    data.wind_speed !== null ? `${data.wind_speed} Km/h` : "--";

  document.getElementById("wind_direction").innerText =
    data.wind_direction !== null ? data.wind_direction : "--";

  updateGlobalWeatherDisplay(data);
};

window.showHistory = async function () {
  const selectedDate = document.getElementById("history-date").value;
  if (!selectedDate) {
    alert("Veuillez sélectionner une date.");
    return;
  }

  try {
    const response = await fetch(
      "http://${window.location.hostname}:5000/api/latest?date=${date}" //Adresse ip du Raspberry pi (local wifi)
    );
    const historyData = await response.json();

    const container = document.getElementById("history-results");
    container.innerHTML = "";

    if (historyData.length === 0) {
      container.innerText = "Aucune donnée disponible pour cette date.";
      return;
    }

    historyData.forEach((entry) => {
      const div = document.createElement("div");
      div.className = "history-entry";
      div.innerText = `${entry.timestamp} | Temp: ${
        entry.temperature ?? "--"
      } °C, Humidité: ${entry.humidity ?? "--"} %, Pression: ${
        entry.pressure ?? "--"
      } hPa, Pluie: ${entry.rain_height ?? "--"} ml, Luminosité: ${
        entry.luminosity ?? "--"
      } lux`;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Erreur lors du chargement de l'historique :", error);
    alert("Erreur lors du chargement de l'historique.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  updateAll();
  updateDateTime();
  showCalendar();

  const historyButton = document.getElementById("btn-show-history");
  if (historyButton) {
    historyButton.addEventListener("click", showHistory);
  }
});
