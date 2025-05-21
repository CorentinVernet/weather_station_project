#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 20, 4); // Adresse I2C de l'écran LCD et dimensions

unsigned long previousMillis2 = 0;
const long delaiProgramme = 5000;

int tour = 0;
const float pi = 3.14159;
const float diameter = 0.14;
const float anemometerFactor = 2.4;

const int numDirections = 8;
const int directionPins[numDirections] = {4, 5, 6, 7, 8, 9, 10, 11};
const char* directions[numDirections] = {"N", "NE", "E", "SE", "S", "SO", "O", "NO"};

void interruption0() {
  tour++;
}

void setup() {
  Serial.begin(9600);
  lcd.init();
  lcd.backlight();
  Wire.begin();

  pinMode(2, INPUT_PULLUP); // Anémomètre
  attachInterrupt(digitalPinToInterrupt(2), interruption0, RISING);

  for (int i = 0; i < numDirections; i++) {
    pinMode(directionPins[i], INPUT_PULLUP);
  }
}

void loop() {
  int directionIndex = getDirectionIndex();
  const char* windDirection = directionIndex != -1 ? directions[directionIndex] : "Indeterminee";

  float windSpeed = (pi * diameter * tour) * anemometerFactor;

  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis2 >= delaiProgramme) {
    previousMillis2 = currentMillis;

    // Impression dans le format structuré pour l'API
    Serial.print("[VENT] ");
    Serial.print("Wind_Speed: ");
    Serial.print(windSpeed);
    Serial.print(" Km/h, Wind_Direction: ");
    Serial.println(windDirection);
  }

  lcd.clear();

  // Affichage vitesse et direction du vent
  lcd.setCursor(0, 2);
  lcd.print("V= ");
  lcd.print(windSpeed);
  lcd.print(" Km/h");

  lcd.setCursor(13, 2);
  lcd.print("Dir= ");
  lcd.print(windDirection);

  tour = 0;
  delay(1000);
}

int getDirectionIndex() {
  for (int i = 0; i < numDirections; i++) {
    if (digitalRead(directionPins[i]) == HIGH) {
      return i;
    }
  }
  return -1;
}

