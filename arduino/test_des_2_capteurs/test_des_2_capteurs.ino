#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <Adafruit_BMP085.h> // pour BMP180/BMP085

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP085 bmp;

LiquidCrystal_I2C lcd(0x27, 16, 2);

int screenState = 0;
unsigned long previousMillis = 0;
const long interval = 3000; // changer d'écran toutes les 3s

void setup() {
  lcd.begin(16, 2);
  lcd.backlight();
  dht.begin();

  if (!bmp.begin()) {
    lcd.setCursor(0, 0);
    lcd.print("BMP erreur !");
    while (1); // stop tout si capteur pression non trouvé
  }
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    screenState = (screenState + 1) % 2;
    lcd.clear();
  }

  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    lcd.setCursor(0, 0);
    lcd.print("Erreur capteur");
    lcd.setCursor(0, 1);
    lcd.print("Temp/Hum invalide");
    return;
  }

  if (screenState == 0) {
    lcd.setCursor(0, 0);
    lcd.print("Temp: ");
    lcd.print(t);
    lcd.print(" C");

    lcd.setCursor(0, 1);
    lcd.print("Humid: ");
    lcd.print(h);
    lcd.print(" %");
  } else {
    float pressure = bmp.readPressure() / 100.0; // hPa
    lcd.setCursor(0, 0);
    lcd.print("Pression: ");
    lcd.print(pressure);
    lcd.print(" hPa");

    lcd.setCursor(0, 1);
    lcd.print("Alt: ");
    lcd.print(bmp.readAltitude());
    lcd.print(" m");
  }

  delay(100); // éviter le scintillement
}

