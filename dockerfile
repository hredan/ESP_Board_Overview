FROM ubuntu:24.04
# Install system requirements
RUN apt update -y
RUN apt upgrade -y
RUN apt install python3 python3-pip curl -y
RUN apt install nodejs npm -y
RUN install -g @angular/cli -y
RUN apt install git -y

# docker build -t esp_board_overview .
# docker run --name esp_board_overview_env -it -v .:/home/workspace/ESP_BOARD_OVERVIEW --workdir /home/workspace/ESP_BOARD_OVERVIEW esp_board_overview bash