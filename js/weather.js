async function fetchWeatherData() {
  try {
    const response = await fetch("../data/data.json");
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

  document.getElementById("temperature").innerText = `${temperature} °C`;
  document.getElementById("wind-speed").innerText = `${windSpeed} km/h`;
  document.getElementById("rain_height").innerText = `${rain_height} ml`;
}

fetchWeatherData();
setInterval(fetchWeatherData, 60000);
