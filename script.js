function updateDateTime() {
  const now = new Date();

  // date : JJ/MM/AAAA
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const dateString = `${day}/${month}/${year}`;

  // heure : HH:MM:SS
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;

  document.getElementById("date").innerText = dateString;
  document.getElementById("time").innerText = timeString;
}

async function fetchWeatherData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des données");

    const data = await response.json();
    updateWeatherDisplay(data);
  } catch (error) {
    console.error("Erreur:", error);
  }
}

function updateWeatherDisplay(data) {
  const temperature = data.temperature;
  const windSpeed = data.wind_speed;

  document.getElementById("temperature").innerText = `${temperature} °C`;
  document.getElementById("wind-speed").innerText = `${windSpeed} km/h`;
}

fetchWeatherData();
setInterval(fetchWeatherData, 60000);

updateDateTime();
setInterval(updateDateTime, 1000);
