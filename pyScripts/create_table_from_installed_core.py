"""
create_table_from_installed_core.py
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
    esp_data_path = "./esp_data"
    core_list_path = os.path.join(esp_data_path, "core_list.txt")  # is created by Scripts/install_esp_cores.sh
    core_info_list = get_installed_core_info(core_list_path)

    core_list_path = os.path.join(esp_data_path, "core_list.json")
    with open(core_list_path, 'w', encoding='utf-8') as f:
        json.dump(core_info_list, f, ensure_ascii=False, indent=4)
    for core_info in core_info_list:
        core_name = core_info["core_name"]
        core_version = core_info["installed_version"]
        core_data_path = f"/home/vscode/.arduino15/packages/{core_name}/hardware/{core_name}/{core_version}"
        cd = CoreData(core_name, core_version, core_data_path)
        print(f"core: {core_name}")
        print(f"number of boards: {len(cd.boards)}")
        print(f"number of boards without led: {cd.num_of_boards_without_led}")
        csv_path = os.path.join(esp_data_path, core_name + ".csv")
        json_path = os.path.join(esp_data_path, core_name + ".json")
        cd.boards_export_csv(filename=csv_path, ignore_missing_led=False)
        cd.boards_export_json(filename=json_path)
