import data from "../assets/data.js";

export async function windDirectionValue() {
  try {
    const windDirection = data.wind_direction;
    let direction = "";

    if (windDirection >= 0 && windDirection < 45) {
      direction = "Nord";
    } else if (windDirection >= 45 && windDirection < 90) {
      direction = "Nord-Est";
    } else if (windDirection >= 90 && windDirection < 135) {
      direction = "Est";
    } else if (windDirection >= 135 && windDirection < 180) {
      direction = "Sud-Est";
    } else if (windDirection >= 180 && windDirection < 225) {
      direction = "Sud";
    } else if (windDirection >= 225 && windDirection < 270) {
      direction = "Sud-Ouest";
    } else if (windDirection >= 270 && windDirection < 315) {
      direction = "Ouest";
    } else {
      direction = "Nord-Ouest";
    }

    return direction;
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    return "Erreur de chargement";
  }
}
