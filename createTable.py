import re
import os.path

from helper.core_data import CoreData


def showList(boards):
    names = sorted(boards.keys())
    for board in names:
        print(f"{board}\t{boards[board]['name']}\t{boards[board]['LED_BUILDIN']}")

def get_installed_core_info(core_list_path):
    core_list = []
    if os.path.exists(core_list_path):
        with open(core_list_path, 'r') as file:
            lines = file.readlines()
            if len(lines) > 1:
                for index, line in enumerate(lines):
                    core_info = {}
                    if index > 0 and line.strip() != "":
                        matches = re.match(r"^([a-z\d]+:[a-z\d]+) +([\.\d]+) +([\.\d]+) +([a-z\d]+)", line.rstrip())
                        if matches:
                            core_info["core"] = matches.group(1)
                            core_info["installed_version"] = matches.group(2)
                            core_info["latest_version"] = matches.group(3)
                            core_info["core_name"] = matches.group(4)
                            core_list.append(core_info)
                            print(core_info)
                        else:
                            print(f"Error: could not parse line {line}")
    else:
        print(f"Error: could not find {core_list_path}")
    return core_list

if __name__ == "__main__":
    script_path = os.path.realpath(os.path.dirname(__file__))
    core_list_path = os.path.join(script_path, "core_list.txt")
    core_info_list = get_installed_core_info(core_list_path)
    for core_info in core_info_list:
        cd = CoreData(core_info["core_name"], core_info["installed_version"])
        print(f"core: {core_info['core_name']}")
        print(f"number of boards: {len(cd.boards)}")
        cd.printTable()


        # print(core_data.keys())