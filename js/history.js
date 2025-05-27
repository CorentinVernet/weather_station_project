document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date-select");
  const backButton = document.getElementById("back-button");

  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  dateInput.addEventListener("change", () => {
    const date = dateInput.value;
    if (date) {
      fetch("http://${window.location.hostname}:5000/api/history?date=${date}")
        .then((response) => response.json())
        .then((data) => populateTable(data))
        .catch((error) => {
          console.error("Erreur de chargement des données :", error);
          alert("Erreur lors du chargement des données. (Problème avec l'API)");
        });
    }
  });
});

function populateTable(data) {
  const tbody = document.querySelector("#history-table tbody");
  tbody.innerHTML = "";

  data.forEach((row) => {
    const tr = document.createElement("tr");

    const time = new Date(row.timestamp);
    const timeFormatted = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    tr.innerHTML = `
      <td data-timestamp="${row.timestamp}">${timeFormatted}</td>
      <td>${row.temperature ?? "--"}</td>
      <td>${row.humidity ?? "--"}</td>
      <td>${row.pressure ?? "--"}</td>
      <td>${row.rain_height ?? "--"}</td>
      <td>${row.luminosity ?? "--"}</td>
      <td>${row.altitude ?? "--"}</td>
      <!-- Ajout des nouvelles cellules pour la vitesse et la direction du vent -->
      <td>${row.wind_speed ?? "--"}</td>
      <td>${row.wind_direction ?? "--"}</td>
    `;

    tbody.appendChild(tr);
  });
}

document.querySelectorAll("#history-table th").forEach((header) => {
  header.addEventListener("click", () => {
    const key = header.getAttribute("data-key");
    const isCurrentlyAsc = header.classList.contains("asc");
    const ascending = !isCurrentlyAsc;

    document
      .querySelectorAll("#history-table th")
      .forEach((th) => th.classList.remove("asc", "desc"));
    header.classList.add(ascending ? "asc" : "desc");

    const tbody = document.querySelector("#history-table tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a, b) => {
      const aCell = a.querySelector(`td:nth-child(${header.cellIndex + 1})`);
      const bCell = b.querySelector(`td:nth-child(${header.cellIndex + 1})`);

      if (key === "timestamp") {
        const aDate = new Date(aCell.getAttribute("data-timestamp"));
        const bDate = new Date(bCell.getAttribute("data-timestamp"));
        return ascending ? aDate - bDate : bDate - aDate;
      }

      const aVal = aCell.textContent;
      const bVal = bCell.textContent;
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      const bothNumbers = !isNaN(aNum) && !isNaN(bNum);

      if (bothNumbers) {
        return ascending ? aNum - bNum : bNum - aNum;
      } else {
        return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
    });

    rows.forEach((row) => tbody.appendChild(row));
  });
});
