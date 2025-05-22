#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// LCD I2C adresse 0x27 ou 0x3F selon le modèle
LiquidCrystal_I2C lcd(0x27, 16, 2);

const int reedPin = 2;           // Pin de l'interrupteur Reed
volatile int count = 0;          // Nombre de passages de l'aimant
float volumeParPassage = 23.3;   // Volume par passage (en ml)

bool lastReedState = HIGH;

void setup() {
  pinMode(reedPin, INPUT_PULLUP); // Utilise la résistance interne

  Serial.begin(9600);  // <-- Communication série avec le Raspberry Pi

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Compteur Eau");

  delay(2000);
  lcd.clear();
}

void loop() {
  bool currentReedState = digitalRead(reedPin);

  // Détection de front descendant (fermeture du reed switch)
    if (lastReedState == HIGH && currentReedState == LOW) {
  count++;
  displayVolume();

  float totalVolume = count * volumeParPassage;

  // Envoie le VOLUME réel (en ml) à Python
  Serial.print("Gouttes detectee: ");
  Serial.println(totalVolume, 1);  // ex: "Gouttes detectee: 23.3"

  delay(200); // Anti-rebond
}


  lastReedState = currentReedState;
}

void displayVolume() {
  float totalVolume = count * volumeParPassage;

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Passages: ");
  lcd.print(count);
  lcd.setCursor(0, 1);
  lcd.print("Eau: ");
  lcd.print(totalVolume, 1);
  lcd.print(" ml");
}

