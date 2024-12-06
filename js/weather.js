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
  const wind_direction = data.wind_direction;

  // Met à jour la température et la vitesse du vent
  document.getElementById("temperature").innerText = `${temperature} °C`;
  document.getElementById("wind-speed").innerText = `${windSpeed} km/h`;
  document.getElementById("rain_height").innerText = `${rain_height} ml`;

  // Met à jour la direction du vent
  const windDirectionText = getWindDirectionIcon(wind_direction);
  document.getElementById(
    "wind_direction"
  ).innerHTML = `${windDirectionText} (${wind_direction}°)`;
}

function getWindDirectionIcon(degrees) {
  let directionIcon;

  if (degrees >= 0 && degrees < 45) {
    directionIcon =
      '<img src="./img/compass_direction/nord.png" alt="Nord" /> Nord';
  } else if (degrees >= 45 && degrees < 135) {
    directionIcon =
      '<img src="./img/compass_direction/est.png" alt="Est" /> Est';
  } else if (degrees >= 135 && degrees < 225) {
    directionIcon =
      '<img src="./img/compass_direction/sud.png" alt="Sud" /> Sud';
  } else if (degrees >= 225 && degrees < 315) {
    directionIcon =
      '<img src="./img/compass_direction/ouest.png" alt="Ouest" /> Ouest';
  }

  return directionIcon;
}

fetchWeatherData();
setInterval(fetchWeatherData, 60000);
