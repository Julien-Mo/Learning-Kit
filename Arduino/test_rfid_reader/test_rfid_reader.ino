#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 53
#define RST_PIN 5

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();

  // Check the version of the RC522 chip
  byte version = mfrc522.PCD_ReadRegister(mfrc522.VersionReg);
  if (version == 0x00 || version == 0xFF) {
    Serial.println("RC522 not detected. Check wiring and connections.");
  } else {
    Serial.print("RC522 detected. Version: 0x");
    Serial.println(version, HEX);
  }
}

void loop() {
  // Do nothing
}
