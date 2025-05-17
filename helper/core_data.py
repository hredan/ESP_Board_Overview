"""
createTable.py
This script generates a table of esp boards with information about board name,
builtin led, and flashsize.

Part of repository: www.gitub.com/hredan/ESP_Board_Overview
Author: hredan
Copyright (c) 2025 hredan"""
import re
import os.path

class CoreData:
    """
    This class is used to parse the boards.txt file of an Arduino core and extract
    information about the boards, including the LED_BUILTIN and flash size.
    """
    def __init__(self, core_name:str, core_version: str,
                 arduino_path:str="/home/vscode/.arduino15"):
        self.core_name = core_name
        self.num_of_boards_without_led = 0
        self.core_path = arduino_path + f"/packages/{core_name}/hardware/{core_name}/{core_version}"
        if not os.path.exists(self.core_path):
            raise ValueError(f"Error: could not found {self.core_path}")

        self.boards_txt = f"{self.core_path}/boards.txt"
        if not os.path.exists(self.boards_txt):
            raise ValueError(f"Error: could not found {self.boards_txt}")
        self.boards = self.__get_data()
        self.__find_led_builtin()
        self.__set_boars_without_led()
        # self.__set_boars_without_flash_size()

    def __get_board_name(self, line:str, boards: dict)-> str:
        match_board = re.match(r"(.+)\.name=(.+)", line)
        if match_board:
            name=match_board.group(1)
            name_full=match_board.group(2)
            boards[name]={"name": name_full}
            return name
        return None

    def __get_variant(self, line:str, boards: dict, name:str):
        match_variant = re.match(name + r"\.build\.variant=(.+)", line)
        if match_variant:
            boards[name]["variant"] = match_variant.group(1)

    def __special_pattern_esp8266(self, line:str, boards: dict, name:str):
        pattern = name + r"\.menu\.eesz\.(.+)\.build\.flash_size=(.+)"
        match_partition = re.match(pattern, line)
        if match_partition:
            flash_partition = match_partition.group(1)
            if flash_partition != "autoflash":
                if "flash_partitions" not in boards[name]:
                    boards[name]["flash_partitions"] = [flash_partition]
                else:
                    boards[name]["flash_partitions"].append(flash_partition)
            else:
                return None
            # align flash size unit with esp32 (M-> MB or K-> KB)
            flash_size = match_partition.group(2)
            if flash_size[-1] != "B":
                flash_size = flash_size + "B"
            return flash_size
        return None

    def __get_data(self):
        boards = {}
        name=""
        with open(self.boards_txt, 'r', encoding='utf8') as infile:
            for line in infile:
                flash_size = None
                find_name = self.__get_board_name(line, boards)
                if find_name:
                    name = find_name
                self.__get_variant(line, boards, name)
                if self.core_name == "esp8266":
                    flash_size = self.__special_pattern_esp8266(line, boards, name)
                else:
                    # esp32 pattern
                    match_partition = re.match(name + r"\.build\.flash_size=(.+)", line)
                    if match_partition:
                        flash_size = match_partition.group(1)
                # store flash size
                if flash_size:
                    if "flash_size" in boards[name]:
                        if flash_size not in boards[name]["flash_size"]:
                            print(f"Warning: {name} has more than on flash size " +
                                  f"{boards[name]['flash_size']} {flash_size}")
                            if flash_size == "512KB":
                                # add 512KB to the beginning of the list
                                boards[name]["flash_size"].insert(0, flash_size)
                            else:
                                boards[name]["flash_size"].append(flash_size)
                    else:
                        boards[name]["flash_size"] = [flash_size]
        return boards

    def __set_boars_without_led(self):
        boards_names = self.boards.keys()
        for board_name in boards_names:
            board_entries = self.boards[board_name].keys()
            if not 'LED_BUILTIN' in board_entries:
                print(f"Error: could not find LED Entry for {board_name} variant: " +
                      f"{self.boards[board_name]['variant']}")
                self.boards[board_name]["LED_BUILTIN"]="N/A"
                variant = self.boards[board_name]['variant']
                file_path = f"{self.core_path}/variants/{variant}/pins_arduino.h"
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf8') as infile:
                        for line_num, line in enumerate(infile):
                            if "LED_BUILTIN" in line:
                                print(f"{line_num} {line}")

    def __set_boars_without_flash_size(self):
        boards_names = self.boards.keys()
        for board_name in boards_names:
            board_entries = self.boards[board_name].keys()
            if not 'flash_size' in board_entries:
                print(f"Error: could not find flash_size Entry for {board_name}")
                self.boards[board_name]["flash_size"]="N/A"

    def __find_led_builtin(self):
        boards_names = self.boards.keys()
        for board_name in boards_names:
            found_led_entry = False
            if "variant" in self.boards[board_name]:
                variant = self.boards[board_name]['variant']
                file_path = f"{self.core_path}/variants/{variant}/pins_arduino.h"
                if not os.path.isfile(file_path):
                    print(f"Error: could not found {file_path}")
                    self.boards[board_name]["LED_BUILTIN"]="N/A"
                else:
                    with open(file_path, 'r', encoding='utf8') as infile:
                        for line in infile:
                            if self.core_name == "esp8266":
                                match_built_in_led = re.match(r"^.+ LED_BUILTIN +\(?(\d+)\)?", line)
                                # #define LED_BUILTIN    (13)
                                # #define LED_BUILTIN    13
                            else:
                                match_built_in_led = re.match(r"^.+ LED_BUILTIN = (\d+)", line)

                            if match_built_in_led:
                                builtin_led_gpio = match_built_in_led.group(1)
                                self.boards[board_name]["LED_BUILTIN"]=builtin_led_gpio
                                found_led_entry = True
            else:
                self.boards[board_name]["LED_BUILTIN"]="N/A"
            if not found_led_entry:
                self.num_of_boards_without_led += 1

    def print_table(self, ignore_missing_led=True):
        """
        Print the table of boards with their name, LED_BUILTIN, and flash size.
        :param ignore_missing_led: If True, ignore boards with LED_BUILTIN = N/A.
        :return: None
        """
        names = sorted(self.boards.keys())
        for board_name in names:
            if ignore_missing_led and self.boards[board_name]["LED_BUILTIN"] == "N/A":
                continue
            name= self.boards[board_name]['name']
            led=self.boards[board_name]['LED_BUILTIN']
            flash_size=self.boards[board_name]['flash_size']
            print(f"{name} | {board_name} | {led} | {flash_size}")

    def export_csv(self, filename:str, ignore_missing_led=True):
        """
        Export the table of boards with their name, LED_BUILTIN, and flash size to a CSV file.	
        :param filename: The name of the CSV file to export to.
        :param ignore_missing_led: If True, ignore boards with LED_BUILTIN = N/A.
        :return: None
        """
        names = sorted(self.boards.keys())
        with open(filename, "w", encoding='utf8') as file:
            file.write("name,board,LED,flash_size\n")
            for board_name in names:
                if ignore_missing_led and self.boards[board_name]["LED_BUILTIN"] == "N/A":
                    continue
                name= self.boards[board_name]['name']
                led=self.boards[board_name]['LED_BUILTIN']
                if 'flash_size' in self.boards[board_name]:
                    flash_size_value=self.boards[board_name]['flash_size']
                    flash_size=f"[{';'.join(flash_size_value)}]"
                else:
                    flash_size='[N/A]'
                file.write(f"{name},{board_name},{led},{flash_size}\n")
