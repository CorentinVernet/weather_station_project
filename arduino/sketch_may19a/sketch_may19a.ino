#include "DHT.h"

#define DHTPIN 2      
#define DHTTYPE DHT11  

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println("Lecture du capteur DHT11...");
}

void loop() {
  int humidite = dht.readHumidity();
  float temperature = dht.readTemperature(); 

  if (isnan(humidite) || isnan(temperature)) {
    Serial.println("Échec de lecture du capteur !");
    return;
  }

  Serial.print("Humidité: ");
  Serial.print(humidite);
  Serial.print(" %\t");
  Serial.print("Température: ");
  Serial.print(temperature);
  Serial.println(" °C");

  delay(1000);
}

