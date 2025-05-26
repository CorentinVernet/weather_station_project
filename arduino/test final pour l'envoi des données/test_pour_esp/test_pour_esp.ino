#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "MeteoPi";
const char* password = "stjacquesmeteo";

void setup() {
  Serial.begin(9600);  // Même baudrate que le MEGA
  Serial.setTimeout(1000);

  Serial.println("[ESP] Connexion au WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n[ESP] Connecté au WiFi !");
  Serial.print("[ESP] IP locale : ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED && Serial.available()) {
    String payload = Serial.readStringUntil('\n');
    Serial.println("[ESP] Trame reçue :");
    Serial.println(payload);

    WiFiClient client;
    HTTPClient http;

    String url = "http://192.168.4.1:5000/api/data";
    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");

    int responseCode = http.POST(payload);

    Serial.print("[ESP] Code HTTP : ");
    Serial.println(responseCode);

    if (responseCode > 0) {
      Serial.println("[ESP] Réponse serveur :");
      Serial.println(http.getString());
    } else {
      Serial.print("[ESP] Erreur POST : ");
      Serial.println(http.errorToString(responseCode));
    }

    http.end();
  }

  delay(500);
}

