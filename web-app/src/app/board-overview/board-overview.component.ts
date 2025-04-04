import { Component, OnInit } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { HttpClient} from '@angular/common/http'; 

@Component({
  selector: 'app-board-overview',
  imports: [],
  templateUrl: './board-overview.component.html',
  styleUrl: './board-overview.component.css'
})
export class BoardOverviewComponent {
  csvData: string = '';
  csvRecords: any;
  constructor(private ngxCsvParser: NgxCsvParser, private httpClient: HttpClient) { }
  ngOnInit() {
    this.getCsvData();
    //this.loadCSV(file);
  }
  getCsvData() {
    const csvFilePath = './esp8266.csv';
    this.httpClient
      .get(csvFilePath, { responseType: 'text' })
      .subscribe((data) => {
        this.csvData = data;
        console.log(this.csvData);
      });
  }
  loadCSV(csvFile: File) {
    
    this.ngxCsvParser.parse(csvFile, { header: true, delimiter: ',' })
    .pipe().subscribe({
      next: (result): void => {
        console.log('Result', result);
        this.csvRecords = result;
      },
      error: (error: NgxCSVParserError): void => {
        console.log('Error', error);
      }
    });
  }
}
