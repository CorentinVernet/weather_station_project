export function updateWindDirection(degrees) {
  const arrow = document.getElementById("arrow");
  const windDirectionText = document.getElementById("wind-direction-text");

  const rotation = degrees;

  arrow.style.transform = `rotate(${rotation}deg)`;

  let directionText;

  if (degrees === 360) {
    degrees = 0;
  }

  if ((degrees >= 0 && degrees < 23) || (degrees >= 337 && degrees < 360)) {
    directionText = "Nord";
  } else if (degrees >= 23 && degrees < 68) {
    directionText = "Nord-Est";
  } else if (degrees >= 68 && degrees < 113) {
    directionText = "Est";
  } else if (degrees >= 113 && degrees < 158) {
    directionText = "Sud-Est";
  } else if (degrees >= 158 && degrees < 203) {
    directionText = "Sud";
  } else if (degrees >= 203 && degrees < 248) {
    directionText = "Sud-Ouest";
  } else if (degrees >= 248 && degrees < 293) {
    directionText = "Ouest";
  } else if (degrees >= 293 && degrees < 337) {
    directionText = "Nord-Ouest";
  }

  windDirectionText.innerText = `${directionText} (${degrees}°)`;
}
