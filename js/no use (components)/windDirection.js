import data from "../assets/data.js";

export async function wind_directionValue() {
  try {
    const wind_direction = data.wind_direction;
    let direction = "";

    if (wind_direction >= 0 && wind_direction < 45) {
      direction = "Nord";
    } else if (wind_direction >= 45 && wind_direction < 90) {
      direction = "Nord-Est";
    } else if (wind_direction >= 90 && wind_direction < 135) {
      direction = "Est";
    } else if (wind_direction >= 135 && wind_direction < 180) {
      direction = "Sud-Est";
    } else if (wind_direction >= 180 && wind_direction < 225) {
      direction = "Sud";
    } else if (wind_direction >= 225 && wind_direction < 270) {
      direction = "Sud-Ouest";
    } else if (wind_direction >= 270 && wind_direction < 315) {
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
