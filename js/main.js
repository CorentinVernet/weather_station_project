import { updateDateTime } from "./dateTime.js";
import { showCalendar } from "./headerContent/calendar.js";

async function fetchLatestData() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/latest");
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
  if (data.temperature !== null) {
    document.getElementById("temperature").innerText = data.temperature + " °C";
  } else {
    document.getElementById("temperature").innerText = "--";
  }
};

window.updateHumidity = async function () {
  const data = await fetchLatestData();
  if (data.humidity !== null) {
    document.getElementById("hygrometrie").innerText = data.humidity + " %";
  } else {
    document.getElementById("hygrometrie").innerText = "--";
  }
};

window.updatePressure = async function () {
  const data = await fetchLatestData();
  if (data.pressure !== null) {
    document.getElementById("pressur").innerText = data.pressure + " hPa";
  } else {
    document.getElementById("pressur").innerText = "--";
  }
};

window.updateRain = async function () {
  const data = await fetchLatestData();
  if (data.rain_height !== null) {
    document.getElementById("rain_height").innerText = data.rain_height + " mm";
  } else {
    document.getElementById("rain_height").innerText = "--";
  }
};

window.updateLuminosity = async function () {
  const data = await fetchLatestData();
  if (data.luminosity !== null) {
    document.getElementById("luminosity").innerText = data.luminosity + " lux";
  } else {
    document.getElementById("luminosity").innerText = "--";
  }
};

window.updateAll = async function () {
  const data = await fetchLatestData();

  if (data.temperature !== null) {
    document.getElementById("temperature").innerText = data.temperature + " °C";
  } else {
    document.getElementById("temperature").innerText = "--";
  }

  if (data.humidity !== null) {
    document.getElementById("hygrometrie").innerText = data.humidity + " %";
  } else {
    document.getElementById("hygrometrie").innerText = "--";
  }

  if (data.pressure !== null) {
    document.getElementById("pressur").innerText = data.pressure + " hPa";
  } else {
    document.getElementById("pressur").innerText = "--";
  }

  if (data.rain_height !== null) {
    document.getElementById("rain_height").innerText = data.rain_height + " mm";
  } else {
    document.getElementById("rain_height").innerText = "--";
  }

  if (data.luminosity !== null) {
    document.getElementById("luminosity").innerText = data.luminosity + " lux";
  } else {
    document.getElementById("luminosity").innerText = "--";
  }

  // ici d'autres capteurs (vent, pollution, etc.)
};

document.addEventListener("DOMContentLoaded", () => {
  updateAll();
  updateDateTime();
  showCalendar();
});
