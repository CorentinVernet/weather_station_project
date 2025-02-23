import data from "../../data/data";

export async function hygrometrieValue() {
  try {
    return `${data.hygrometrie} %`;
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    return "Erreur de chargement";
  }
}
