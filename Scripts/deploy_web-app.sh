#!/bin/bash
# This script deploys the web app to the docs folder for GitHub Pages.
# It is designed to be run in a Linux environment, specifically Ubuntu 22.04.
cd /workspaces/ESP_Board_Overview/docs/
rm -r *.*
cd /workspaces/ESP_Board_Overview/web-app/
ng build --base-href "https://hredan.github.io/ESP_Board_Overview/"
cp -r /workspaces/ESP_Board_Overview/web-app/dist/web-app/browser/* /workspaces/ESP_Board_Overview/docs/
