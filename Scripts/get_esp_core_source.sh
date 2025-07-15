#!/bin/bash.
rm -rf ./esp_data
mkdir ./esp_data
cd ./esp_data
curl -O https://espressif.github.io/arduino-esp32/package_esp32_index.json
curl -O https://arduino.esp8266.com/stable/package_esp8266com_index.json