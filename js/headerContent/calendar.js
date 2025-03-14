export function showCalendar() {
  const calendarElement = document.getElementById("calendar");

  if (!calendarElement) {
    console.error("Élément avec l'ID 'calendar' non trouvé.");
    return;
  }

  const now = new Date();
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  let currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  function renderCalendar(month, year) {
    const monthName = monthNames[month];
    const firstDay = new Date(year, month, 0).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    const header = `<div class="calendar-header">${monthName} ${year}</div>`;
    let days = "<div class='calendar-days'>";

    for (let i = 0; i < firstDay; i++) {
      days += "<div class='calendar-day empty'></div>";
    }

    for (let day = 1; day <= lastDay; day++) {
      const todayClass =
        day === now.getDate() && month === now.getMonth() ? " today" : "";
      days += `<div class='calendar-day${todayClass}'>${day}</div>`;
    }

    days += "</div>";

    calendarElement.innerHTML = header + days;
  }

  renderCalendar(currentMonth, currentYear);

  window.changeMonth = function (direction) {
    currentMonth += direction;

    if (currentMonth < 0) {
      currentMonth = 11;
    } else if (currentMonth > 11) {
      currentMonth = 0;
    }

    renderCalendar(currentMonth, currentYear);
  };
}
