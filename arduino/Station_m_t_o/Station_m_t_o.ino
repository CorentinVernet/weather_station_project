#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP085_U.h>

LiquidCrystal_I2C lcd(0x27, 20, 4); // Adresse I2C de l'écran LCD et dimensions
DHT dht(13, DHT22); // Broche du capteur DHT22
Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10085);

#define VALEUR_PLUVIOMETRE 1.9 // Valeur en ml d'eau à chaque bascule d'auget
volatile unsigned int countPluviometre = 0; // Compteur de basculements
float pluvio1min = 0;  // Pluie sur 1 minute
unsigned long previousMillis2 = 0; // Pour le suivi du délai
const long delaiProgramme = 5000; // Délai de 1 minute en millisecondes

const int ledPin = 12; // Broche de la LED

void countRain() {
  countPluviometre++;
}

int tour = 0;
const float pi = 3.14159;
const float diameter = 0.14; // Diamètre en mètres (exemple)
const float anemometerFactor = 2.4; // Facteur pour convertir rotations en vitesse (exemple)
const int numDirections = 8;
const int directionPins[numDirections] = {4, 5, 6, 7, 8, 9, 10, 11}; // Broches des capteurs ILS
const char* directions[numDirections] = {"N", "NE", "E", "SE", "S", "SO", "O", "NO"};
const int analogPin = A0; // Broche analogique où le capteur MQ est connecté
int sensorValue = 0; // Variable pour stocker la valeur lue du capteur

void interruption0() {
  tour++;
}

void setup() {
  Serial.begin(9600);
  lcd.init(); // Initialisation de l'écran LCD
  lcd.backlight(); // Allumage du rétroéclairage
  Wire.begin(); // Début de la communication I2C
  dht.begin(); // Initialisation du capteur DHT22
  pinMode(2, INPUT_PULLUP); // Broche de l'anémomètre avec résistance pull-up interne
  pinMode(3, INPUT_PULLUP); // Broche du pluviomètre avec résistance pull-up interne
  pinMode(analogPin, INPUT); // Définition de la broche analogique comme entrée
  pinMode(ledPin, OUTPUT); // Définition de la broche de la LED comme sortie
  attachInterrupt(digitalPinToInterrupt(2), interruption0, RISING);
  attachInterrupt(digitalPinToInterrupt(3), countRain, FALLING); // Attache de l'interruption pour le pluviomètre

  for (int i = 0; i < numDirections; i++) {
    pinMode(directionPins[i], INPUT_PULLUP);
  }
}

void loop() {
  // Lecture de la température et de l'humidité
  float t = dht.readTemperature(); // Température en degrés Celsius
  float h = dht.readHumidity(); // Humidité relative en pourcentage
  sensorValue = analogRead(analogPin); // Lecture de la valeur analogique du capteur
  float voltage = sensorValue * (5.0 / 1023.0); // Conversion de la valeur en tension (0-5V)
  float co2_ppm = voltage * 412; // Exemple de conversion, à ajuster selon la courbe de votre capteur

  sensors_event_t event;
  bmp.getEvent(&event);

  float temperature;
  bmp.getTemperature(&temperature);

  int directionIndex = getDirectionIndex();

  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis2 >= delaiProgramme) {
    previousMillis2 = currentMillis;
    pluvio1min = countPluviometre * VALEUR_PLUVIOMETRE;
    countPluviometre = 0;
    Serial.print("Vitesse du vent en Km/h : ");
    Serial.println((pi * diameter * tour) * anemometerFactor);
    Serial.print("Direction: ");
    Serial.println(directions[directionIndex]);
  }
  // Affichage des données sur l'écran LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("T= ");
  lcd.print(t);
  lcd.print("C");
  lcd.setCursor(10, 0);
  lcd.print("CO2= ");
  lcd.print(co2_ppm);

  lcd.setCursor(0, 1);
  lcd.print("H= ");
  lcd.print(h);
  lcd.print("% ");
  lcd.setCursor(0, 3);
  lcd.print("Press= ");
  lcd.print(event.pressure*432);
  lcd.print(" hPa");

  lcd.setCursor(0, 2);
  lcd.print("V= ");
  lcd.print((pi * diameter * tour) * anemometerFactor);
  lcd.print(" Km/h");

  lcd.setCursor(13, 2);
  lcd.print("Dir= ");
  lcd.print(directions[directionIndex]);
  
  lcd.setCursor(10, 1);
  lcd.print("P= ");
  lcd.print(pluvio1min);
  lcd.print("ml");

  // Contrôle de la LED en fonction du niveau de CO2
  if (co2_ppm > 1000) {
    digitalWrite(ledPin, HIGH); // Allume la LED si le CO2 dépasse 1000 ppm
  } else {
    digitalWrite(ledPin, LOW); // Éteint la LED sinon
  }

  tour = 0;
  
  // Délai de 2 secondes avant la prochaine lecture
  delay(2000);
}

int getDirectionIndex() {
  // Lecture des capteurs ILS et détermination de la direction
  for (int i = 0; i < numDirections; i++) {
    if (digitalRead(directionPins[i]) == LOW) {
      return i;
    }
  }
  // Si aucun capteur n'est activé, retourner -1 (aucune direction)
  return -1;
}

