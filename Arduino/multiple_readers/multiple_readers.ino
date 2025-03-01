#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN_1 53
#define SS_PIN_2 49
#define RST_PIN 5

MFRC522 rfid1(SS_PIN_1, RST_PIN);
MFRC522 rfid2(SS_PIN_2, RST_PIN);

void setup() {
  Serial.begin(9600);
  delay(1000);
  SPI.begin();

  // Initialize both RFID sensors
  rfid1.PCD_Init();
  rfid2.PCD_Init();

  Serial.println("Ready to read RFID tags...");
}

void loop() {
  // Check the first RFID sensor
  if (rfid1.PICC_IsNewCardPresent() && rfid1.PICC_ReadCardSerial()) {
    Serial.print("Sensor 1 - RFID Tag UID: ");
    printHex(rfid1.uid.uidByte, rfid1.uid.size);
    Serial.println("");
    rfid1.PICC_HaltA();
  }

  // Check the second RFID sensor
  if (rfid2.PICC_IsNewCardPresent() && rfid2.PICC_ReadCardSerial()) {
    Serial.print("Sensor 2 - RFID Tag UID: ");
    printHex(rfid2.uid.uidByte, rfid2.uid.size);
    Serial.println("");
    rfid2.PICC_HaltA();
  }
}

// Routine to dump a byte array as hex values to Serial
void printHex(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
}
