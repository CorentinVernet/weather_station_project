#include <Wire.h>
#include <LiquidCrystal_I2C.h>

//#include <DHT.h>
//#include <Adafruit_Sensor.h>
//#include <Adafruit_BMP085_U.h>

LiquidCrystal_I2C lcd(0x27, 20, 4); // Adresse I2C de l'écran LCD et dimensions

 /*
DHT dht(13, DHT22); // Capteur DHT22 (Température, Humidité)
Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10085); // Baromètre

#define VALEUR_PLUVIOMETRE 1.9 // mm par bascule
volatile unsigned int countPluviometre = 0;
float pluvio1min = 0;
 */

unsigned long previousMillis2 = 0;
const long delaiProgramme = 5000;

 /*
const int ledPin = 12; // LED CO2
 */

void countRain() {
  // Interrupt pluviomètre (non utilisée)
  /*
  countPluviometre++;
  */
}

int tour = 0;
const float pi = 3.14159;
const float diameter = 0.14;
const float anemometerFactor = 2.4;

const int numDirections = 8;
const int directionPins[numDirections] = {4, 5, 6, 7, 8, 9, 10, 11};
const char* directions[numDirections] = {"N", "NE", "E", "SE", "S", "SO", "O", "NO"};

/*
const int analogPin = A0;
int sensorValue = 0;
*/

void interruption0() {
  tour++;
}

void setup() {
  Serial.begin(9600);
  lcd.init();
  lcd.backlight();
  Wire.begin();

  /*
  dht.begin();
  pinMode(3, INPUT_PULLUP); // Pluviomètre
  pinMode(analogPin, INPUT); // Capteur gaz
  pinMode(ledPin, OUTPUT); // LED
  attachInterrupt(digitalPinToInterrupt(3), countRain, FALLING);
  */

  pinMode(2, INPUT_PULLUP); // Anémomètre
  attachInterrupt(digitalPinToInterrupt(2), interruption0, RISING);

  for (int i = 0; i < numDirections; i++) {
    pinMode(directionPins[i], INPUT_PULLUP);
  }
}

void loop() {
  /* 
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  sensorValue = analogRead(analogPin);
  float voltage = sensorValue * (5.0 / 1023.0);
  float co2_ppm = voltage * 412;

  sensors_event_t event;
  bmp.getEvent(&event);
  float temperature;
  bmp.getTemperature(&temperature);
  */

  int directionIndex = getDirectionIndex();

  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis2 >= delaiProgramme) {
    previousMillis2 = currentMillis;

    /* 
    pluvio1min = countPluviometre * VALEUR_PLUVIOMETRE;
    countPluviometre = 0;
    */

    Serial.print("Vitesse du vent en Km/h : ");
    Serial.println((pi * diameter * tour) * anemometerFactor);
    Serial.print("Direction: ");
    if (directionIndex != -1) {
      Serial.println(directions[directionIndex]);
    } else {
      Serial.println("Indéterminée");
    }
  }

  lcd.clear();
  /* 
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
  lcd.print(event.pressure * 432);
  lcd.print(" hPa");

  lcd.setCursor(10, 1);
  lcd.print("P= ");
  lcd.print(pluvio1min);
  lcd.print("mm");
  */

  // Affichage vitesse et direction du vent
  lcd.setCursor(0, 2);
  lcd.print("V= ");
  lcd.print((pi * diameter * tour) * anemometerFactor);
  lcd.print(" Km/h");

  lcd.setCursor(13, 2);
  lcd.print("Dir= ");
  if (directionIndex != -1) {
    lcd.print(directions[directionIndex]);
  } else {
    lcd.print("??");
  }

  /* 
  if (co2_ppm > 1000) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
  */

  tour = 0;
  delay(1000);
}

int getDirectionIndex() {
  for (int i = 0; i < numDirections; i++) {
    if (digitalRead(directionPins[i]) == LOW) {
      return i;
    }
  }
  return -1;
}

