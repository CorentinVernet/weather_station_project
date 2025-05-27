export function updateDateTime() {
  const now = new Date();

  // date : JJ/MM/AAAA
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const dateString = `${day}/${month}/${year}`;

  // heure : HH:MM:SS
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;

  document.getElementById("date").innerText = dateString;
  document.getElementById("time").innerText = timeString;
}

setInterval(updateDateTime, 1000);
