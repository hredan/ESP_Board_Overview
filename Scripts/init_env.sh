#!/bin/bash
# This script installs google-chrome and the required node packages for the ESP Board Overview web app.
# It is designed to be run in a Linux environment, specifically Ubuntu 22.04.
sudo apt update
sudo apt upgrade -y

sudo apt install python3-venv -y
python3 -m venv /workspaces/ESP_Board_Overview/.venv
source /workspaces/ESP_Board_Overview/.venv/bin/activate
pip install --upgrade pip
pip install -r /workspaces/ESP_Board_Overview/requirements_test.txt

# install google chrome
# cd ~
# wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# sudo apt install ./google-chrome*.deb -y
# sudo apt-get install -y ./google-chrome-stable_current_amd64.deb
# export CHROME_BIN=/usr/bin/google-chrome

# install web-app packages
cd /workspaces/ESP_Board_Overview/web-app/
npm install -g npm@latest
npm install