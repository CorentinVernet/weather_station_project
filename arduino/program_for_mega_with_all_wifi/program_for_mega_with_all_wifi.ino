#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_TSL2561_U.h>
#include <Adafruit_BMP085.h>
#include <DHT.h>
#include <WiFiEsp.h>
#include <SoftwareSerial.h>

// === WiFi ===
char ssid[] = "MeteoPi";
char pass[] = "stjacquesmeteo";
int status = WL_IDLE_STATUS;
WiFiEspClient client;

SoftwareSerial espSerial(18, 19); // RX, TX pour ESP

// === DHT11 ===
#define DHTPIN 22
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// === BMP180 & TSL2561 (I2C)
Adafruit_BMP085 bmp;
Adafruit_TSL2561_Unified tsl = Adafruit_TSL2561_Unified(TSL2561_ADDR_FLOAT, 12345);

// === Pluviomètre ===
#define PLUVIOMETRE_PIN 3
volatile int pluieCompteur = 0;
const float volumeParPassage = 23.3;
volatile unsigned long lastPluieInterrupt = 0;
unsigned long totalGouttes = 0;

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
  espSerial.begin(9600);
  WiFi.init(&espSerial);

  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("[ERREUR] Module WiFi non détecté !");
    while (true);
  }

  while (status != WL_CONNECTED) {
    Serial.println("[WIFI] Connexion au réseau...");
    status = WiFi.begin(ssid, pass);
    delay(5000);
  }

  while (!client.connect("192.168.4.1", 5001)) {
    Serial.println("[WIFI] Connexion au Raspberry échouée...");
    delay(3000);
  }

  Serial.println("[WIFI] Connecté !");
  dht.begin();

  if (!bmp.begin()) while (1);
  if (!tsl.begin()) while (1);
  tsl.enableAutoRange(true);
  tsl.setIntegrationTime(TSL2561_INTEGRATIONTIME_402MS);

  pinMode(PLUVIOMETRE_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PLUVIOMETRE_PIN), incrementPluie, FALLING);

  pinMode(ANEMO_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(ANEMO_PIN), incrementRotation, FALLING);

  for (int i = 0; i < numDirections; i++) pinMode(directionPins[i], INPUT_PULLUP);

  lastWindMillis = millis();
}

void loop() {
  unsigned long now = millis();

  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float pressure = bmp.readPressure() / 100.0;
  float altitude = bmp.readAltitude() + 53;

  if (!isnan(h) && !isnan(t)) {
    sendLine("[ENVIRONNEMENT] Temp: " + String(t) + " °C, Hum: " + String(h) +
             " %, Press: " + String(pressure) + " hPa, Alt: " + String(altitude) + " m");
  }

  sensors_event_t event;
  tsl.getEvent(&event);
  if (event.light) {
    sendLine("[LUMINOSITE] " + String(event.light) + " lux");
  }

  static int previousPluieCompteur = 0;
  noInterrupts();
  int nouvellesGouttes = pluieCompteur - previousPluieCompteur;
  previousPluieCompteur = pluieCompteur;
  interrupts();
  totalGouttes += nouvellesGouttes;

  float volume = totalGouttes * volumeParPassage;
  sendLine("[PLUIE] Total gouttes: " + String(totalGouttes) + " → Volume total: " + String(volume, 1) + " ml");

  if (now - lastWindMillis >= intervalVent) {
    float windSpeed = (float)rotations / 2.0 * anemometerFactor;
    const char* direction = getWindDirection();

    sendLine("[VENT] Vitesse: " + String(windSpeed, 1) + " km/h, Direction: " + String(direction));
    rotations = 0;
    lastWindMillis = now;
  }

  delay(5000);
}

void sendLine(String line) {
  Serial.println(line);
  if (client.connected()) {
    client.println(line);
  } else {
    Serial.println("[WIFI] Perte de connexion !");
  }
}

void incrementPluie() {
  unsigned long currentMillis = millis();
  if (currentMillis - lastPluieInterrupt > 300) {
    pluieCompteur++;
    lastPluieInterrupt = currentMillis;
  }
}

void incrementRotation() {
  rotations++;
}

const char* getWindDirection() {
  for (int i = 0; i < numDirections; i++) {
    if (digitalRead(directionPins[i]) == HIGH) {
      return directions[i];
    }
  }
  return "NA";
}

