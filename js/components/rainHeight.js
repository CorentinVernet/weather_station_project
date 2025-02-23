import data from "../assets/data.js";

export async function rainHeightValue() {
  try {
    return `${data.rain_height} mm`;
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    return "Erreur de chargement";
  }
}
