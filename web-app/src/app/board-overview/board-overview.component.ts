import { Component, Injectable, inject, input } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Sort, MatSortModule} from '@angular/material/sort';
import { HttpClient} from '@angular/common/http'; 

@Component({
  selector: 'app-board-overview',
  imports: [MatTableModule, MatInputModule, MatFormFieldModule, MatSortModule, MatPaginatorModule],
  templateUrl: './board-overview.component.html',
  styleUrl: './board-overview.component.css'
})


// @Injectable({
//   providedIn: 'root'
// })
export class BoardOverviewComponent {
  coreName = input.required<string>();
  dataSource: BoardInfo[] = [];
  totalBoardCount: number = 0;
  filteredBoardCount: number = 0;
  displayedColumns: string[] = ['name', 'board', 'led', 'flash_size'];
  sortedData: MatTableDataSource<BoardInfo> = new MatTableDataSource<BoardInfo>(this.dataSource);
  filterValue: string = '';
  httpClient: HttpClient;

  constructor() { this.httpClient = inject(HttpClient); }
  ngOnInit() {
    console.log('Board Overview Component Initialized');
    console.log('Core Name:', this.coreName());
    this.getBoardData(this.coreName());
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.sortedData = new MatTableDataSource<BoardInfo>(this.dataSource);
    this.sortedData.filter = this.filterValue.trim().toLowerCase();
    this.filteredBoardCount = this.sortedData.filteredData.length;
  }
  getBoardData(coreName: string = '') {
    const csvFilePath = './' + coreName + '.csv';
    console.log('CSV File Path:', csvFilePath);
    this.httpClient
      .get(csvFilePath, { responseType: 'text' })
      .subscribe((data) => {
        let csvData: string = data;
        let lines = csvData.split('\n');
        let header_string = lines.shift();
        if (header_string === undefined) {
          console.error('Header string is undefined');
          return;
        }
        let headers = header_string.split(',');
        console.log('Headers:', headers);
        let boardInfos: BoardInfo[] = [];
        lines.forEach((line) => {
          let values = line.split(',');
          if (values.length == this.displayedColumns.length) {
            let board_info: BoardInfo= {
              name: '',
              board: '',
              led: '',
              flash_size: ''
            };
            for (let i = 0; i < this.displayedColumns.length; i++) {
              let header = this.displayedColumns[i].trim();
              let value = values[i].trim();
              if (header === 'name') {
                board_info.name = value;
              } else if (header === 'board') {
                board_info.board = value;
              } else if (header === 'led') {
                board_info.led = value;
              } else if (header === 'flash_size') {
                board_info.flash_size = value;
              }
            }
            boardInfos.push(board_info);
            //console.log('add Board Info:', board_info);
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

    if (!sort.active || sort.direction === '') {
      this.sortedData = new MatTableDataSource<BoardInfo>(data);
      return;
    }

    this.sortedData = new MatTableDataSource<BoardInfo>(data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'board':
          return compare(a.board, b.board, isAsc);
        case 'led':
          return compareNum(a.led, b.led, isAsc);
        case 'flash_size':
          return compare(a.flash_size, b.flash_size, isAsc);
        default:
          return 0;
      }
    }));
  }
}

export interface BoardInfo {
  name: string;
  board: string;
  led: string;
  flash_size: string;
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compareNum(a: number | string, b: number | string, isAsc: boolean) {
  let aNum = parseInt(a as string);
  let bNum = parseInt(b as string);
  return (aNum < bNum ? -1 : 1) * (isAsc ? 1 : -1);
}