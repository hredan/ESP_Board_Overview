#!/bin/bash

TOOL_DIR="./tools"
# https://github.com/arduino/arduino-cli
ARDUINO_CLI_VERSION="1.2.0"

CORE_URL_EPS32="https://espressif.github.io/arduino-esp32/package_esp32_index.json"
CORE_URL_ESP8266="https://arduino.esp8266.com/stable/package_esp8266com_index.json"

# https://github.com/espressif/arduino-esp32
EPS32_CORE_VERSION="3.1.3"


# set TOOL_URL and TOOL PATH (depends on OS)
#check tool dir#
if [ ! -d "$TOOL_DIR" ]
	then
		echo "## create $TOOL_DIR ##"
		mkdir $TOOL_DIR
fi

if [ ! -f "$TOOL" ]; then
	echo "## download and unpack ARDUINO_CLI ##"
	cd "$TOOL_DIR"

	case $OSTYPE in
		linux-gnu)
			TOOL_ACHIVE_NAME="arduino-cli_${ARDUINO_CLI_VERSION}_Linux_64bit.tar.gz"
			TOOL_URL="https://github.com/arduino/arduino-cli/releases/download/v${ARDUINO_CLI_VERSION}/$TOOL_ACHIVE_NAME"
			TOOL=./tools/arduino-cli
			curl -kLSs $TOOL_URL -o $TOOL_ACHIVE_NAME
			tar -xf ./$TOOL_ACHIVE_NAME
			;;
		msys)
			TOOL_ACHIVE_NAME="arduino-cli_${ARDUINO_CLI_VERSION}_Windows_64bit.zip"
			TOOL_URL="https://github.com/arduino/arduino-cli/releases/download/v${ARDUINO_CLI_VERSION}/$TOOL_ACHIVE_NAME"
			TOOL=./tools/arduino-cli.exe
			curl -kLSs $TOOL_URL -o $TOOL_ACHIVE_NAME
			unzip -o $TOOL_ACHIVE_NAME
			;;
		*)
			echo "OS: $OSTYPE currently not supported!"
			exit 1
			;;
	esac
	cd ..
fi