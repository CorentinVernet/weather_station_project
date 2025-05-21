#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <Adafruit_BMP085.h>

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP085 bmp;

LiquidCrystal_I2C lcd(0x27, 16, 2);

int screenState = 0;
unsigned long previousMillis = 0;
const long interval = 3000;

void setup() {
  Serial.begin(9600); // Port série pour Raspberry Pi
  lcd.begin(16, 2);
  lcd.backlight();
  dht.begin();

  if (!bmp.begin()) {
    lcd.setCursor(0, 0);
    lcd.print("BMP erreur !");
    while (1);
  }
}

void loop() {
  unsigned long currentMillis = millis();

  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float pressure = bmp.readPressure() / 100.0; // en hPa
  float altitude = bmp.readAltitude();         // en mètres

  if (isnan(h) || isnan(t)) {
    lcd.setCursor(0, 0);
    lcd.print("Erreur capteur");
    lcd.setCursor(0, 1);
    lcd.print("Temp/Hum invalide");
  } else {
    // Envoie sur le port série (format pour Python)
    Serial.print("Temp: ");
    Serial.print(t);
    Serial.print(" C, Hum: ");
    Serial.print(h);
    Serial.print(" %, Press: ");
    Serial.print(pressure);
    Serial.print(" hPa, Alt: ");
    Serial.print(altitude);
    Serial.println(" m");

    // Affichage LCD (alternance)
    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      screenState = (screenState + 1) % 2;
      lcd.clear();
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
      lcd.setCursor(0, 0);
      lcd.print("Pression: ");
      lcd.print(pressure);
      lcd.print(" hPa");
      lcd.setCursor(0, 1);
      lcd.print("Alt: ");
      lcd.print(altitude);
      lcd.print(" m");
    }
  }

  delay(1000); // pause entre chaque mesure/transmission
}

