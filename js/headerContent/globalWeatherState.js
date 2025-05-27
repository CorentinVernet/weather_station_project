export function getWeatherCondition(data) {
  const temp = data.temperature;
  const humidity = data.humidity;
  const rain = data.rain_height;
  const wind = data.wind_speed;
  const luminosity = data.luminosity;
  const pressure = data.pressure;

  // 1. Pluie
  if (rain > 1) {
    if (rain > 100) return "Fortement pluvieux";
    return "Pluvieux";
  }

  // 2. Orage (pression basse + humidité + nuages)
  if (pressure < 1000 && humidity > 80 && luminosity < 200) {
    return "Orageux";
  }

  // 3. Ensoleillé
  if (luminosity > 800 && humidity < 60 && temp >= 20) {
    return "Ensoleillé";
  }

  // 4. Nuageux (faible luminosité mais pas de pluie)
  if (luminosity < 400 && humidity > 50) {
    return "Nuageux";
  }

  // 5. Froid
  if (temp < 8 && humidity > 40) {
    return "Froid";
  }

  // 6. Venteux
  if (wind >= 20) {
    return "Venteux";
  }

  // 7. Variable (conditions moyennes, entre plusieurs états)
  if (
    temp >= 10 &&
    temp <= 20 &&
    humidity >= 40 &&
    humidity <= 70 &&
    luminosity >= 400 &&
    luminosity <= 800
  ) {
    return "Variable";
  }

  // 8. Par défaut
  return "Modéré";
}
