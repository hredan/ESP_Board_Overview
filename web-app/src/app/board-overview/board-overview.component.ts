import { Component, inject, input, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Sort, MatSortModule} from '@angular/material/sort';
import { HttpClient} from '@angular/common/http'; 

@Component({
  selector: 'app-board-overview',
  imports: [MatTableModule, MatInputModule, MatFormFieldModule, MatSortModule, MatPaginatorModule, MatCheckboxModule],
  templateUrl: './board-overview.component.html',
  styleUrl: './board-overview.component.css'
})

export class BoardOverviewComponent implements OnInit {
  checked = false;
  coreName = input.required<string>();
  dataSource: BoardInfo[] = [];
  totalBoardCount = 0;
  filteredBoardCount = 0;
  displayedColumns: string[] = ['name', 'board', 'led', 'flash_size'];
  sortedData: MatTableDataSource<BoardInfo> = new MatTableDataSource<BoardInfo>(this.dataSource);
  filterValue = '';
  httpClient: HttpClient;

  constructor() { this.httpClient = inject(HttpClient); }
  ngOnInit() {
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
        const header_string = lines.shift();
        if (header_string === undefined) {
          console.error('Header string is undefined');
          return;
        }
        const headers = header_string.split(',');
        const boardInfos: BoardInfo[] = [];
        lines.forEach((line) => {
          const values = line.split(',');
          if (values.length == this.displayedColumns.length) {
            const board_info: BoardInfo= {
              name: '',
              board: '',
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
              } else if (header === 'led') {
                board_info.led = value;
              } else if (header === 'flash_size') {
                board_info.flash_size = value;
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

function compare(a: string, b: string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compareNum(a: string, b: string, isAsc: boolean) {
  console.log('isAsc: ' + isAsc)
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