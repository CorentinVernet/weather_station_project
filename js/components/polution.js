import data from "../data/data.js";

export async function polutionValue() {
  try {
    return `${data.polution} g`;
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    return "Erreur de chargement";
  }
}
