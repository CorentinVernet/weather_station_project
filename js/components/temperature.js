import data from "../data/data.js";

export async function temperatureValue() {
  try {
    return `${data.temperature} °C`;
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    return "Erreur de chargement";
  }
}
