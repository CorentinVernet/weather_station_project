// components/windSpeed.js

// Fonction pour retourner la vitesse du vent avec l'unité
export async function windSpeedValue() {
  try {
    const response = await fetch("../../data/data.json"); // Charger le fichier JSON
    if (!response.ok) {
      throw new Error("Impossible de charger les données");
    }
    const data = await response.json(); // Parser le JSON

    return `${data.wind_speed} km/h`; // Retourner la vitesse du vent avec l'unité
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    return "Erreur de chargement"; // Gérer les erreurs de chargement
  }
}
