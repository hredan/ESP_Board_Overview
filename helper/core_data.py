import re
import os.path

class CoreData:
    def __init__(self, core_name, core_version):
        self.core_name = core_name
        self.core_path = f"~/.arduino15/packages/{core_name}/hardware/{core_name}/{core_version}"
        if not os.path.exists(self.core_path):
            self.core_path = f"/root/.arduino15/packages/{core_name}/hardware/{core_name}/{core_version}"
            if not os.path.exists(self.core_path):
                raise ValueError(f"Error: could not found {self.core_path}")

        self.boards_txt = f"{self.core_path}/boards.txt"
        if not os.path.exists(self.boards_txt):
            raise ValueError(f"Error: could not found {self.boards_txt}")
        self.boards = self.get_data()
        self.find_led_builtin()
        self.set_boars_without_led()
        self.set_boars_without_flash_size()

    def get_data(self):
        boards = {}
        name=""
        with open(self.boards_txt, 'r') as infile:
            for line in infile:
                matchBoard = re.match(r"(.+)\.name=(.+)", line)
                if matchBoard:
                    name=matchBoard.group(1)
                    nameIDE=matchBoard.group(2)
                    boards[name]={"name": nameIDE}
                # e.g. d1_mini.build.variant=d1_mini
                matchVariant = re.match(name + r"\.build\.variant=(.+)", line)
                if matchVariant:
                    boards[name]["variant"] = matchVariant.group(1)
                if self.core_name == "esp8266":
                    matchPartition = re.match(name + r"\.menu\.eesz\.(.+)\.build\.flash_size=(.+)", line)
                    if matchPartition:
                        flash_partition = matchPartition.group(1)
                        if "flash_partitions" not in boards[name]:
                            boards[name]["flash_partitions"] = [flash_partition]
                        else:
                            boards[name]["flash_partitions"].append(flash_partition)

                        flash_size = matchPartition.group(2)
                        if "flash_size" in boards[name]:
                            if boards[name]["flash_size"] != flash_size:
                                print(f"Error: {name} has different flash size {boards[name]['flash_size']} != {flash_size}")
                            else:
                                boards[name]["flash_sheme"] = flash_size
                else:
                    matchPartition = re.match(name + r"\.build\.flash_size=(.+)", line)
                    if matchPartition:
                        boards[name]["flash_size"] = matchPartition.group(1)
        return boards
    
    def set_boars_without_led(self):
        boardsNames = self.boards.keys()
        for boardName in boardsNames:
            boardEntries = self.boards[boardName].keys()
            if not 'LED_BUILDIN' in boardEntries:
                print(f"Error: could not find LED Entry for {boardName}")
                self.boards[boardName]["LED_BUILDIN"]="N/A"

    def set_boars_without_flash_size(self):
        boardsNames = self.boards.keys()
        for boardName in boardsNames:
            boardEntries = self.boards[boardName].keys()
            if not 'flash_size' in boardEntries:
                print(f"Error: could not find flash_size Entry for {boardName}")
                self.boards[boardName]["flash_size"]="N/A"

    def find_led_builtin(self):
        boardsNames = self.boards.keys()
        for boardName in boardsNames:
            if "variant" in self.boards[boardName]:
                filePath = f"{self.core_path}/variants/{self.boards[boardName]["variant"]}/pins_arduino.h"
                if not os.path.isfile(filePath):
                    print(f"Error: could not found {filePath}")
                    self.boards[boardName]["LED_BUILDIN"]="N/A"
                else:
                    with open(filePath, 'r') as infile:
                        for line in infile:                    
                            if self.core_name == "esp8266":
                                matchBuildInLED = re.match(r"^.+ LED_BUILTIN (\d+)", line)
                            else:
                                matchBuildInLED = re.match(r"^.+ LED_BUILTIN = (\d+)", line)

                            if matchBuildInLED:
                                self.boards[boardName]["LED_BUILDIN"]=matchBuildInLED.group(1)
                                # print(f"add {boardName} LED GPIO: {self.boards[boardName]['LED_BUILDIN']}")
                            else:
                                self.boards[boardName]["LED_BUILDIN"]="N/A"
            else:
                # print(f"Error: could not find variant for {boardName}")
                self.boards[boardName]["LED_BUILDIN"]="N/A"
    def printTable(self):
        names = sorted(self.boards.keys())
        for boardName in names:
            print(f"{self.boards[boardName]['name']} | {boardName} | {self.boards[boardName]['LED_BUILDIN']} | {self.boards[boardName]['flash_size']}")

    def print_data(self):
        print(self.data)