#!/bin/bash
# This script deploys the web app to the docs folder for GitHub Pages.
# It is designed to be run in a Linux environment, specifically Ubuntu 22.04.
cd /workspaces/esp-board-overview/web-app/
ng deploy --base-href "https://hredan.github.io/esp-board-overview/"
