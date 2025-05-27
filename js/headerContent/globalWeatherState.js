export function getWeatherCondition(data) {
  if (!data || Object.keys(data).length === 0) return "Données indisponibles";

  const {
    temperature,
    humidity,
    pressure,
    luminosity,
    rain_height,
    wind_speed,
  } = data;

  // Gestion des valeurs manquantes
  if (
    temperature == null ||
    humidity == null ||
    luminosity == null ||
    rain_height == null ||
    wind_speed == null
  ) {
    return "Données incomplètes";
  }

  // Seuils ajustés intelligemment
  if (rain_height > 20) {
    return "Fortement pluvieux";
  }

  if (rain_height > 5) {
    return "Pluvieux";
  }

  if (wind_speed > 25) {
    return "Venteux";
  }

  if (temperature < 5) {
    return "Froid";
  }

  if (luminosity > 1000 && humidity < 60 && rain_height < 1) {
    return "Ensoleillé";
  }

  if (humidity > 70 && rain_height < 2 && luminosity < 400) {
    return "Nuageux";
  }

  if (
    temperature >= 10 &&
    temperature <= 20 &&
    humidity >= 40 &&
    humidity <= 70
  ) {
    return "Variable";
  }

  return "Modéré";
}
