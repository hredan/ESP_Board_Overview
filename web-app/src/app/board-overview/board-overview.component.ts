import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { HttpClient} from '@angular/common/http'; 

@Component({
  selector: 'app-board-overview',
  imports: [MatTableModule, MatInputModule, MatFormFieldModule, MatSortModule, MatPaginatorModule],
  templateUrl: './board-overview.component.html',
  styleUrl: './board-overview.component.css'
})
export class BoardOverviewComponent {
  dataSource: MatTableDataSource<BoardInfo> = new MatTableDataSource<BoardInfo>();
  displayedColumns: string[] = ['name', 'board', 'led', 'flash_size'];

  constructor(private httpClient: HttpClient) { }
  ngOnInit() {
    this.getBoardData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getBoardData() {
    const csvFilePath = './esp8266.csv';
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
              let header = headers[i].trim();
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
          this.dataSource = new MatTableDataSource<BoardInfo>(boardInfos);
        });
      });
  }
}

export interface BoardInfo {
  name: string;
  board: string;
  led: string;
  flash_size: string;
}
