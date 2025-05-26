#include <DHT.h>
#include <Adafruit_BMP085.h>
#include <Adafruit_TSL2561_U.h>
#include <ArduinoJson.h>

#define DHTPIN 22
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

Adafruit_BMP085 bmp;
Adafruit_TSL2561_Unified tsl = Adafruit_TSL2561_Unified(TSL2561_ADDR_FLOAT, 12345);

// --------- Rain & Wind ----------
volatile int rainPulses = 0;
volatile int windPulses = 0;
unsigned long lastResetTime = 0;

const float rainPerPulse = 19.4; // mL par impulsion
const float pi = 3.14159;
const float diameter = 0.14; // m en mètre
const float anemometerFactor = 2.4; // facteur multiplicatif

void rainISR() {
  rainPulses++;
}

void windISR() {
  windPulses++;
}

void setup() {
  Serial.begin(115200);    // Debug USB
  Serial3.begin(9600);     // Vers ESP
  Serial1.begin(9600);     // Depuis Arduino Nano (direction du vent)

  Serial.println("[MEGA] Initialisation des capteurs...");

  dht.begin();
  bmp.begin();
  tsl.begin();

  pinMode(2, INPUT_PULLUP); // Reed rain
  attachInterrupt(digitalPinToInterrupt(2), rainISR, FALLING);

  pinMode(3, INPUT_PULLUP); // Anémomètre
  attachInterrupt(digitalPinToInterrupt(3), windISR, RISING);

  lastResetTime = millis();

  Serial.println("[MEGA] Capteurs initialisés.");
}

void loop() {
  // --- Capteurs principaux ---
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  float pressure = bmp.readPressure() / 100.0;
  float altitude = bmp.readAltitude() + 86.0;  // étalonnage

  sensors_event_t event;
  tsl.getEvent(&event);
  int luminosity = (event.light) ? event.light : 0;

  // --- Pluie ---
  float rain_height = (rainPulses / 5.0) * rainPerPulse;

  // --- Vitesse du vent ---
  float windSpeed = (pi * diameter * windPulses) * anemometerFactor;

  // --- Direction du vent depuis le Nano ---
  String wind_direction = "NA";
  if (Serial1.available()) {
    wind_direction = Serial1.readStringUntil('\n');
    wind_direction.trim(); // Nettoyage
  }

  // --- Reset journalier pluie ---
  if (millis() - lastResetTime >= 86400000UL) {  // 24h
    rainPulses = 0;
    lastResetTime = millis();
    Serial.println("[MEGA] Reset quotidien du pluviomètre.");
  }

  // --- Compilation JSON ---
  StaticJsonDocument<256> doc;
  doc["temperature"] = temp;
  doc["humidity"] = humidity;
  doc["pressure"] = pressure;
  doc["altitude"] = altitude;
  doc["luminosity"] = luminosity;
  doc["rain_height"] = rain_height;
  doc["wind_speed"] = windSpeed;
  doc["wind_direction"] = wind_direction;

  String output;
  serializeJson(doc, output);

  Serial.println("[MEGA] JSON généré :");
  Serial.println(output);

  Serial3.println(output);  // Envoi vers ESP

  // Reset des tours de vent à chaque cycle
  windPulses = 0;

  delay(5000);
}

