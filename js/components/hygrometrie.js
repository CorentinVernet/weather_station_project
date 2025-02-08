// components/hygrometrie.js

// Fonction pour retourner l'humidité avec l'unité
export async function hygrometrieValue() {
  try {
    const response = await fetch("../../data/data.json"); // Charger le fichier JSON
    if (!response.ok) {
      throw new Error("Impossible de charger les données");
    }
    const data = await response.json(); // Parser le JSON

    return `${data.hygrometrie} %`; // Retourner l'humidité avec l'unité
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    return "Erreur de chargement"; // Gérer les erreurs de chargement
  }
}
