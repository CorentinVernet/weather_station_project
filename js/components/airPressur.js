import data from "../data/data.js";

export async function airPressurValue() {
  try {
    return `${data.pressur} bar`;
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    return "Erreur de chargement";
  }
}
