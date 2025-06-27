"""
create_table.py
This script generates a table of esp boards with information about board name,
builtin led, and flashsize.

Part of repository: www.gitub.com/hredan/ESP_Board_Overview
Author: hredan
Copyright (c) 2025 hredan
"""
import re
import os.path
import json

from helper.core_data import CoreData

def get_installed_core_info(core_list_path_):
    """
    Get the installed core information from the core_list.txt file.
    :param core_list_path_: Path to the core_list.txt file.
    :return: List of dictionaries containing core information."""
    core_list = []
    if os.path.exists(core_list_path_):
        with open(core_list_path_, 'r', encoding='utf8') as file:
            lines = file.readlines()
            if len(lines) > 1:
                for index, line in enumerate(lines):
                    core_info_ = {}
                    if index > 0 and line.strip() != "":
                        pattern = r"^([a-z\d]+:[a-z\d]+) +([\.\d]+) +([\.\d]+) +([a-z\d]+)"
                        matches = re.match(pattern, line.rstrip())
                        if matches:
                            core_info_["core"] = matches.group(1)
                            core_info_["installed_version"] = matches.group(2)
                            core_info_["latest_version"] = matches.group(3)
                            core_info_["core_name"] = matches.group(4)
                            core_list.append(core_info_)
                            print(core_info_)
                        else:
                            print(f"Error: could not parse line {line}")
    else:
        print(f"Error: could not find {core_list_path_}")
    return core_list

if __name__ == "__main__":
    script_path = os.path.realpath(os.path.dirname(__file__))
    core_list_path = os.path.join(script_path, "core_list.txt")
    core_info_list = get_installed_core_info(core_list_path)

    with open('core_list.json', 'w', encoding='utf-8') as f:
        json.dump(core_info_list, f, ensure_ascii=False, indent=4)
    for core_info in core_info_list:
        cd = CoreData(core_info["core_name"], core_info["installed_version"])
        print(f"core: {core_info['core_name']}")
        print(f"number of boards: {len(cd.boards)}")
        print(f"number of boards without led: {cd.num_of_boards_without_led}")
        cd.boards_export_csv(filename=core_info['core_name']+".csv", ignore_missing_led=False)
        cd.boards_export_json(filename=core_info['core_name']+".json")
