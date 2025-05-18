import { Component, inject, input, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Sort, MatSortModule} from '@angular/material/sort';
import { HttpClient} from '@angular/common/http';
import coreList_input from '../../../public/core_list.json';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-board-overview',
  imports: [MatTableModule, MatInputModule, MatFormFieldModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, NgIf],
  templateUrl: './board-overview.component.html',
  styleUrl: './board-overview.component.css'
})

export class BoardOverviewComponent implements OnInit {
  checked = false;
  coreName = input.required<string>();
  dataSource: BoardInfo[] = [];
  totalBoardCount = 0;
  filteredBoardCount = 0;
  displayedColumns: string[] = ['name', 'board','variant', 'led', 'flash_size'];
  sortedData: MatTableDataSource<BoardInfo> = new MatTableDataSource<BoardInfo>(this.dataSource);
  filterValue = '';
  httpClient: HttpClient;
  coreList: Core[] = (coreList_input as Core[]);
  coreVersion = '';

  constructor() { this.httpClient = inject(HttpClient); }
  ngOnInit() {
    this.coreList.forEach((core) => {
      if (core.core_name === this.coreName()) {
        this.coreVersion = core.installed_version;
      }
    });
    this.getBoardData(this.coreName());
  }

  updateTable() {
    if (this.checked) {
      const ignoreNA: BoardInfo[] = [];
      this.dataSource.forEach((boardInfo) => {
        if (boardInfo.led !== 'N/A') {
          ignoreNA.push(boardInfo);
        }
      });
      this.sortedData = new MatTableDataSource<BoardInfo>(ignoreNA);
    }
    else {
      this.sortedData = new MatTableDataSource<BoardInfo>(this.dataSource);
    }
    
    this.sortedData.filter = this.filterValue.trim().toLowerCase();
    this.filteredBoardCount = this.sortedData.filteredData.length;
  }

  applyIgnoreNA(event: MatCheckboxChange) {
    this.checked = event.checked;
    this.updateTable();
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.updateTable();
  }
  getBoardData(coreName = '') {
    const csvFilePath = './' + coreName + '.csv';
    this.httpClient
      .get(csvFilePath, { responseType: 'text' })
      .subscribe((data) => {
        const csvData: string = data;
        const lines = csvData.split('\n');
        // remove header
        lines.shift();
        const boardInfos: BoardInfo[] = [];
        lines.forEach((line) => {
          const values = line.split(',');
          if (values.length == this.displayedColumns.length) {
            const board_info: BoardInfo= {
              name: '',
              board: '',
              variant: '',
              linkPins: '',
              led: '',
              flash_size: ''
            };
            for (let i = 0; i < this.displayedColumns.length; i++) {
              const header = this.displayedColumns[i].trim();
              const value = values[i].trim();
              if (header === 'name') {
                board_info.name = value;
              } else if (header === 'board') {
                board_info.board = value;
              } else if (header === 'variant') {
                board_info.variant = value;
              } else if (header === 'led') {
                board_info.led = value;
              } else if (header === 'flash_size') {
                board_info.flash_size = value;
              }
            }
            if (board_info.variant !== 'N/A') {
              if (this.coreName() === 'esp32') {
                board_info.linkPins = "https://github.com/espressif/arduino-esp32/blob/" + this.coreVersion + "/variants/" + board_info.variant + "/pins_arduino.h"
              }
              else if (this.coreName() === 'esp8266') {
                board_info.linkPins = "https://github.com/esp8266/Arduino/blob/" + this.coreVersion + "/variants/" + board_info.variant + "/pins_arduino.h";
              }
            }
            boardInfos.push(board_info);
          }
          this.dataSource = boardInfos;
          this.totalBoardCount = this.dataSource.length;
          this.filteredBoardCount = this.dataSource.length;
          this.sortedData = new MatTableDataSource<BoardInfo>(this.dataSource);
        });
      });
  }
  sortData(sort: Sort) {
    let data : BoardInfo[] = [];
    if (this.filterValue != '') {
      data = this.sortedData.filteredData.slice();
    }
    else {
      data = this.sortedData.data.slice();
    }

    this.sortedData = new MatTableDataSource<BoardInfo>(data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'board':
          return compare(a.board, b.board, isAsc);
        case 'led':
          return compareLed(a.led, b.led, isAsc);
        case 'flash_size':
          return compareFlashSize(a.flash_size, b.flash_size, isAsc);
        default:
          return 0;
      }
    }));
  }
}

export interface BoardInfo {
  name: string;
  board: string;
  variant: string;
  linkPins: string;
  led: string;
  flash_size: string;
}

export interface Core {
  core: string;
  installed_version: string;
  latest_version: string;
  core_name: string;
}

function compare(a: string, b: string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compareLed(a: string, b: string, isAsc: boolean) {
  if (a === 'N/A')
  {
    a = '1000';
  }

  if (b === 'N/A')
  {
    b = '1000';
  }

  const aNum = parseInt(a as string);
  const bNum = parseInt(b as string);

  return (aNum < bNum ? -1 : 1) * (isAsc ? 1 : -1);
}

function get_flash_size_value(a: string, isAsc: boolean) {
  let flash_size = a.slice(1, -1);
  const list = flash_size.split(';');
  if (list.length > 1) {
    if (isAsc){
      flash_size = list[0];
    }
    else{
      flash_size = list[list.length - 1];
    }
  }
  if (flash_size === '512KB') {
    return 0;
  }
  else
  {
    let num = parseInt(flash_size.slice(0, -2));
    if (Number.isNaN(num)) {
      num = 0;
    }
    return num;
  }
}

function compareFlashSize(a: string, b: string, isAsc: boolean) {
  const aNum = get_flash_size_value(a, isAsc);
  const bNum = get_flash_size_value(b, isAsc);
  return (aNum < bNum ? -1 : 1) * (isAsc ? 1 : -1);
}