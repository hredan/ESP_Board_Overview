import re
import os.path

# esp32c3.menu.PartitionScheme.default=Default 4MB with spiffs (1.2MB APP/1.5MB SPIFFS)

# esp_core_dir = r"C:\Users\andre\AppData\Local\Arduino15\packages\esp32\hardware\esp32\2.0.1"
esp_core_dir = r"C:\Users\andre\AppData\Local\Arduino15\packages\esp8266\hardware\esp8266\3.1.2"
esp8266 = True

filename = f"{esp_core_dir}/boards.txt"


def find_boards_4MB():
    boards = {}
    name=""
    with open(filename, 'r') as infile:
        for line in infile:
            matchBoard = re.match("(.+)\.name=(.+)", line)
            if esp8266:
                matchPartition = re.match(f"{name}\.menu\.eesz\.4M2M\.build\.flash_size=4M", line)
            else:
                matchPartition = re.match(f"{name}\.build\.flash_size=4MB", line)
            
            if matchBoard:
                name=matchBoard.group(1)
                nameIDE=matchBoard.group(2)

            if matchPartition:
                boards[name]={"name": nameIDE} 
                #print(f"{match.group(1)}\t{match.group(2)}")
    return boards

def check_led(boards):
    boardsNames = boards.keys()
    removeBoards = []
    for boardName in boardsNames:
        filePath = f"{esp_core_dir}/variants/{boardName}/pins_arduino.h"
        if not os.path.isfile(filePath):
            print(f"Error: could not found {filePath}")
            removeBoards.append(boardName)
        else:
            with open(filePath, 'r') as infile:
                for line in infile:                    
                    if esp8266:
                        matchBuildInLED = re.match("^.+ LED_BUILTIN (\d+)", line)
                    else:
                        matchBuildInLED = re.match("^.+ LED_BUILTIN = (\d+)", line)

                    if matchBuildInLED:
                        boards[boardName]["LED_BUILDIN"]=matchBuildInLED.group(1)
                        print(f"add {boardName} LED GPIO: {boards[boardName]['LED_BUILDIN']}")
    
    removeBoardsFromDict(boards, removeBoards)

def check_boars_without_led(boards):
    boardsNames = boards.keys()
    # removeBoards = []
    for boardName in boardsNames:
        boardEntries = boards[boardName].keys()
        if not 'LED_BUILDIN' in boardEntries:
            print(f"Error: could not find LED Entry for {boardName}")
            # removeBoards.append(boardName)
            boards[boardName]["LED_BUILDIN"]="N/A"
    # removeBoardsFromDict(boards, removeBoards)

def removeBoardsFromDict(boards, removeList):
    print(f"Info: Remove {len(removeList)} boards")
    for boardName in removeList:
        del boards[boardName]

def showList(boards):
    names = sorted(boards.keys())
    for board in names:
        print(f"{board}\t{boards[board]['name']}\t{boards[board]['LED_BUILDIN']}")

def printTable(boards):
    names = sorted(boards.keys())
    for board in names:
        print(f"N/A | {boards[board]['name']} | {board} | {boards[board]['LED_BUILDIN']}")

boards = find_boards_4MB()
check_led(boards)

check_boars_without_led(boards)

print(f"Found: {len(boards.keys())} board entries")

showList(boards)

printTable(boards)


