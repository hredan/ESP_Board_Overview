import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BoardOverviewComponent, BoardInfo } from './board-overview.component';
import { provideHttpClient } from '@angular/common/http';
import { Sort } from '@angular/material/sort';

describe('BoardOverviewComponent', () => {
  let component: BoardOverviewComponent;
  let fixture: ComponentFixture<BoardOverviewComponent>;
  const testCoreName = 'test';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      imports: [BoardOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardOverviewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('coreName', testCoreName);
    fixture.detectChanges();
    
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  function testReq(reqAnswer: string = "") {
    const httpTesting = TestBed.inject(HttpTestingController);
    const req = httpTesting.expectOne('./'+ testCoreName +'.csv');
    if (reqAnswer !== "") {
      req.flush(reqAnswer);
    }
    else{
      req.flush('name,board,led,flash_size\nESP32,ESP32,LED1,4MB\nESP8266,ESP8266,LED2,2MB');
    }
}

  it('should create', () => {
    testReq();
    expect(component).toBeTruthy();
  });

  it('should have the correct core name', () => {
    testReq();
    expect(component.coreName()).toEqual(testCoreName);
  });

  it('should fetch board data from CSV file', () => {
    const csvData = 'name,board,led,flash_size\nESP32,ESP32,LED1,4MB\nESP8266,ESP8266,LED2,2MB';
    testReq(csvData);
    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[0].name).toBe('ESP32');
    expect(component.dataSource[1].name).toBe('ESP8266');
  }
  );

  it('should fetch board data from CSV file with empty lines at end', () => {
    const csvData = 'name,board,led,flash_size\nESP32,ESP32,LED1,4MB\nESP8266,ESP8266,LED2,2MB\n\n';
    testReq(csvData);
    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[0].name).toBe('ESP32');
    expect(component.dataSource[1].name).toBe('ESP8266');
  }
  );

  it('should render title', () => {
      testReq();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain(testCoreName.toUpperCase() + ' Board Overview');
    });

  it('should apply filter', () => {
    const csvData = 'name,board,led,flash_size\nESP32,ESP32,LED1,4MB\nESP8266,ESP8266,LED2,2MB';
    testReq(csvData);
    const mockEvent: Event = <Event><any>{
      target: {
          value: 'ESP32'
      }
    };
    component.applyFilter(mockEvent);
    expect(component.sortedData.filteredData.length).toBe(1);
    expect(component.sortedData.filteredData[0].name).toBe('ESP32');
  }
  );

  it('should apply filter with empty string', () => {
    const csvData = 'name,board,led,flash_size\nESP32,ESP32,LED1,4MB\nESP8266,ESP8266,LED2,2MB';
    testReq(csvData);
    const mockEvent: Event = <Event><any>{
      target: {
          value: ''
      }
    };
    component.applyFilter(mockEvent);
    expect(component.sortedData.filteredData.length).toBe(2);
  }
  );

  it('should sort data by name', () => {
    const csvData = 'name,board,led,flash_size\nESP32,ESP32,LED1,4MB\nESP8266,ESP8266,LED2,2MB';
    testReq(csvData);

    const sort: Sort = { active: 'name', direction: 'asc' };
    component.sortData(sort);
    expect(component.dataSource[0].name).toBe('ESP32');
    expect(component.dataSource[1].name).toBe('ESP8266');

  }
  );

  it('should sort data by board asc', () => {
    const csvData = 'name,board,led,flash_size\nESP32,ESP32,LED1,4MB\nESP8266,ESP8266,LED2,2MB';
    testReq(csvData);

    const sort: Sort = { active: 'board', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].board).toBe('ESP32');
    expect(data[1].board).toBe('ESP8266');

  }
  );

  it('should sort data by board desc', () => {
    const csvData = 'name,board,led,flash_size\nESP32,ESP32,LED1,4MB\nESP8266,ESP8266,LED2,2MB';
    testReq(csvData);

    const sort: Sort = { active: 'board', direction: 'desc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].board).toBe('ESP8266');
    expect(data[1].board).toBe('ESP32');
  }
  );

  it('should sort data by led asc', () => {
    const csvData = 'name,board,led,flash_size\nESP32,ESP32,2,4MB\nESP8266,ESP8266,1,2MB';
    testReq(csvData);

    const sort: Sort = { active: 'led', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].led).toBe('1');
    expect(data[1].led).toBe('2');
  }
  );

  it('should sort data by led desc input 2, 1', () => {
    const csvData = 'name,board,led,flash_size\nESP32,ESP32,2,4MB\nESP8266,ESP8266,1,2MB';
    testReq(csvData);

    const sort: Sort = { active: 'led', direction: 'desc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].led).toBe('2');
    expect(data[1].led).toBe('1');
  }
  );

  it('should sort data by led desc input 1, 2', () => {
    const csvData = 'name,board,led,flash_size\nESP32,ESP32,1,4MB\nESP8266,ESP8266,2,2MB';
    testReq(csvData);

    const sort: Sort = { active: 'led', direction: 'desc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].led).toBe('2');
    expect(data[1].led).toBe('1');
  }
  );

  it('should sort data by led and filter', () => {
    const csvData = 'name,board,led,flash_size\nESP32,ESP32,2,4MB\nESP8266,ESP8266,2,2MB\nESP32,ESP32,1,6MB';
    testReq(csvData);
    // Apply filter to show only ESP32
    const mockEvent: Event = <Event><any>{
      target: {
          value: 'ESP32'
      }
    };
    component.applyFilter(mockEvent);

    const sort: Sort = { active: 'led', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data.length).toBe(2);
    expect(data[0].led).toBe('1');
    expect(data[1].led).toBe('2');
  }
  );

  it('should sort data by flash_size', () => {
    const csvData = 'name,board,led,flash_size\nESP32,ESP32,LED1,4MB\nESP8266,ESP8266,LED2,2MB';
    testReq(csvData);

    const sort: Sort = { active: 'flash_size', direction: 'asc' };
    component.sortData(sort);
    expect(component.dataSource[0].flash_size).toBe('2MB');
    expect(component.dataSource[1].flash_size).toBe('4MB');

  }
  );
});
