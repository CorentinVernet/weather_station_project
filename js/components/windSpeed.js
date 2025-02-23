import data from "../../data/data";

export async function windSpeedValue() {
  try {
    return `${data.wind_speed} km/h`;
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    return "Erreur de chargement";
  }
}
