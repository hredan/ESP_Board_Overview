#!/bin/bash

# For windows this script can be executed in the git bash.

TOOL_DIR="./tools"
# https://github.com/arduino/arduino-cli
ARDUINO_CLI_VERSION="1.2.0"

CORE_URL_ESP32="https://espressif.github.io/arduino-esp32/package_esp32_index.json"
CORE_URL_ESP8266="https://arduino.esp8266.com/stable/package_esp8266com_index.json"

# https://github.com/espressif/arduino-esp32
EPS32_CORE_VERSION="3.1.3"
ESP8266_CORE_VERSION="3.1.2"


# set TOOL_URL and TOOL PATH (depends on OS)
#check tool dir#
if [ ! -d "$TOOL_DIR" ]
	then
		echo "## create $TOOL_DIR ##"
		mkdir $TOOL_DIR
fi

case $OSTYPE in
	linux-gnu)
		TOOL_ACHIVE_NAME="arduino-cli_${ARDUINO_CLI_VERSION}_Linux_64bit.tar.gz"
		TOOL_URL="https://github.com/arduino/arduino-cli/releases/download/v${ARDUINO_CLI_VERSION}/$TOOL_ACHIVE_NAME"
		TOOL=./tools/arduino-cli
		;;
	msys)
		TOOL_ACHIVE_NAME="arduino-cli_${ARDUINO_CLI_VERSION}_Windows_64bit.zip"
		TOOL_URL="https://github.com/arduino/arduino-cli/releases/download/v${ARDUINO_CLI_VERSION}/$TOOL_ACHIVE_NAME"
		TOOL=./tools/arduino-cli.exe
		;;
	*)
		echo "OS: $OSTYPE currently not supported!"
		exit 1
		;;
esac

if [ ! -f "$TOOL" ]; then
	echo "## download and unpack ARDUINO_CLI ##"
	cd "$TOOL_DIR"

	curl -kLSs $TOOL_URL -o $TOOL_ACHIVE_NAME
	case $OSTYPE in
		linux-gnu)
			tar -xf ./$TOOL_ACHIVE_NAME
			;;
		msys)
			unzip -o $TOOL_ACHIVE_NAME
			;;
		*)
			echo "OS: $OSTYPE currently not supported!"
			exit 1
			;;
	esac
	cd ..
fi

# install core esp32
$TOOL core update-index --additional-urls $CORE_URL_ESP32
$TOOL core install esp32:esp32 --additional-urls $CORE_URL_ESP32

# install core esp8266
$TOOL core update-index --additional-urls $CORE_URL_ESP8266
$TOOL core install esp8266:esp8266 --additional-urls $CORE_URL_ESP8266

$TOOL core list

cp ~/.arduino15/packages/esp32/hardware/esp32/3.1.3/boards.txt ./boards_esp32.txt
cp ~/.arduino15/packages/esp8266/hardware/esp8266/3.1.2/boards.txt ./boards_esp8266.txt
