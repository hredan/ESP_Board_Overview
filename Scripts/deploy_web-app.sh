cd /workspaces/ESP_Board_Overview/docs/
rm -r *.*
cd /workspaces/ESP_Board_Overview/web-app/
ng build --base-href "https://hredan.github.io/ESP_Board_Overview/"
cp -r /workspaces/ESP_Board_Overview/web-app/dist/web-app/browser/* /workspaces/ESP_Board_Overview/docs/
