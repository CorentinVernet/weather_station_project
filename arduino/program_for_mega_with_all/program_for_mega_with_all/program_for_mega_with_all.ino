#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_TSL2561_U.h>
#include <Adafruit_BMP085.h>
#include <DHT.h>

// === DHT11 ===
#define DHTPIN 22
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// === BMP180 & TSL2561 (I2C sur SDA=20, SCL=21) ===
Adafruit_BMP085 bmp;
Adafruit_TSL2561_Unified tsl = Adafruit_TSL2561_Unified(TSL2561_ADDR_FLOAT, 12345);

unsigned long lastResetTime = 0;
const unsigned long oneDayMillis = 86400000UL; // 24h

// === Pluviomètre ===
#define PLUVIOMETRE_PIN 3
volatile int pluieCompteur = 0;
const float volumeParPassage = 23.3; // en millilitres
volatile unsigned long lastPluieInterrupt = 0; // anti-rebond
unsigned long totalGouttes = 0; // cumul sur le long terme

// === Anémomètre ===
#define ANEMO_PIN 2
volatile int rotations = 0;
const float anemometerFactor = 2.4;
unsigned long lastWindMillis = 0;
const unsigned long intervalVent = 5000;

// === Direction du vent ===
const int numDirections = 8;
const int directionPins[numDirections] = {4, 5, 6, 7, 8, 9, 10, 11};
const char* directions[numDirections] = {"N", "NE", "E", "SE", "S", "SO", "O", "NO"};

void setup() {
  Serial.begin(9600);
  Wire.begin();

  // DHT11
  dht.begin();

  // BMP180
  if (!bmp.begin()) {
    Serial.println("[ERREUR] BMP180 non détecté !");
    while (1);
  }

  // TSL2561
  if (!tsl.begin()) {
    Serial.println("[ERREUR] TSL2561 non détecté !");
    while (1);
  }
  tsl.enableAutoRange(true);
  tsl.setIntegrationTime(TSL2561_INTEGRATIONTIME_402MS);

  // Pluviomètre
  pinMode(PLUVIOMETRE_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PLUVIOMETRE_PIN), incrementPluie, FALLING);

  // Anémomètre
  pinMode(ANEMO_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(ANEMO_PIN), incrementRotation, FALLING);

  // Direction du vent
  for (int i = 0; i < numDirections; i++) {
    pinMode(directionPins[i], INPUT_PULLUP);
  }

  lastWindMillis = millis();
}

void loop() {
  unsigned long now = millis();

  // === ENVIRONNEMENT ===
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float pressure = bmp.readPressure() / 100.0;
  float altitude = bmp.readAltitude() +53;

  if (!isnan(h) && !isnan(t)) {
    Serial.print("[ENVIRONNEMENT] Temp: ");
    Serial.print(t);
    Serial.print(" °C, Hum: ");
    Serial.print(h);
    Serial.print(" %, Press: ");
    Serial.print(pressure);
    Serial.print(" hPa, Alt: ");
    Serial.print(altitude);
    Serial.println(" m");
  } else {
    Serial.println("[ENVIRONNEMENT] Erreur DHT11.");
  }

  // === LUMINOSITÉ ===
  sensors_event_t event;
  tsl.getEvent(&event);
  if (event.light) {
    Serial.print("[LUMINOSITE] ");
    Serial.print(event.light);
    Serial.println(" lux");
  } else {
    Serial.println("[LUMINOSITE] Trop sombre ou erreur lecture.");
  }

  // === PLUIE ===
  static int previousPluieCompteur = 0;
  noInterrupts();
  int nouvellesGouttes = pluieCompteur - previousPluieCompteur;
  previousPluieCompteur = pluieCompteur;
  interrupts();
  totalGouttes += nouvellesGouttes;

  float volume = totalGouttes * volumeParPassage;
  Serial.print("[PLUIE] Total gouttes: ");
  Serial.print(totalGouttes);
  Serial.print(" → Volume total: ");
  Serial.print(volume, 1);
  Serial.println(" ml");

  if (now - lastResetTime > oneDayMillis) {
  totalGouttes = 0;
  pluieCompteur = 0;
  lastResetTime = now;
  Serial.println("[RESET] Données pluie réinitialisées");
  }


  // === VENT ===
  if (now - lastWindMillis >= intervalVent) {
    float windSpeed = (float)rotations / 2.0 * anemometerFactor;
    const char* direction = getWindDirection();

    Serial.print("[VENT] Vitesse: ");
    Serial.print(windSpeed, 1);
    Serial.print(" km/h, Direction: ");
    Serial.println(direction);

    rotations = 0;
    lastWindMillis = now;
  }

  delay(5000); // pause entre chaque mesure
}

// === Interruptions ===
void incrementPluie() {
  unsigned long currentMillis = millis();
  if (currentMillis - lastPluieInterrupt > 150) { // anti-rebond 300ms
    pluieCompteur++;
    lastPluieInterrupt = currentMillis;
  }
}

void incrementRotation() {
  rotations++;
}

// === Lire direction vent ===
const char* getWindDirection() {
  for (int i = 0; i < numDirections; i++) {
    if (digitalRead(directionPins[i]) == HIGH) {
      return directions[i];
    }
  }
  return "NA";
}

