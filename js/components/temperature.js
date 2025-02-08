export async function temperatureValue() {
  try {
    const response = await fetch("../../data/data.json");
    if (!response.ok) {
      throw new Error("Impossible de charger les données");
    }
    const data = await response.json();

    return `${data.temperature} °C`;
  } catch (error) {
    console.error("Erreur de chargement des données :", error);
    return "Erreur de chargement";
  }
}
