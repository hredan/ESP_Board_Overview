import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BoardOverviewComponent, BoardInfo } from './board-overview.component';
import { provideHttpClient } from '@angular/common/http';
import { Sort } from '@angular/material/sort';
import { MatCheckboxChange } from '@angular/material/checkbox';

const csv_header = 'name,board,variant,led,mcu,flash_size\n';
const testset_answer = csv_header + 'LOLIN(WeMos) D1 R1,d1,d1,2,esp8266a,[4MB]\nSparkFun Blynk Board,blynk,thing,5,esp8266b,[8MB]\n';
const testset_answer_na = csv_header + 'LOLIN(WeMos) D1 R1,d1,d1,2,esp8266,[4MB]\nSparkFun Blynk Board,blynk,N/A,N/A,N/A,[N/A]\n';
const testset_na = 'WiFiduino,wifiduino,wifiduino,N/A,esp8266,[4MB]\n';
const testset_generic = 'Generic ESP8266 Module,generic,generic,1,esp8266,[512KB;1MB;2MB;4MB;8MB;16MB]\n';

describe('BoardOverviewComponent', () => {
  let component: BoardOverviewComponent;
  let fixture: ComponentFixture<BoardOverviewComponent>;
  const testCoreName = 'esp8266';

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

  function testReq(reqAnswer = "") {
    const httpTesting = TestBed.inject(HttpTestingController);
    const req = httpTesting.expectOne('./'+ testCoreName +'.csv');
    if (reqAnswer !== "") {
      req.flush(reqAnswer);
    }
    else{
      req.flush(testset_answer);
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
    testReq(testset_answer);
    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[0].name).toBe('LOLIN(WeMos) D1 R1');
    expect(component.dataSource[1].name).toBe('SparkFun Blynk Board');
  }
  );

  it('should fetch board data from CSV file with empty lines at end', () => {
    const csvData = testset_answer + '\n';
    testReq(csvData);
    expect(component.dataSource.length).toBe(2);
    expect(component.dataSource[0].board).toBe('d1');
    expect(component.dataSource[1].board).toBe('blynk');
  }
  );

  it('should render title', () => {
      testReq();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain(testCoreName.toUpperCase() + ' Board Overview');
    });

  it('should apply filter', () => {
    testReq(testset_answer);
    const mockEvent: Event = 
    ({
      target: {
          value: 'd1'
      }
    } as unknown) as Event;
    component.applyFilter(mockEvent);
    const data = component.sortedData.filteredData
    expect(data.length).toBe(1);
    expect(data[0].board).toBe('d1');
  }
  );

  it('should apply filter with empty string', () => {
    testReq(testset_answer);
    const mockEvent: Event = ({
      target: {
          value: ''
      }
    } as unknown) as Event;
    component.applyFilter(mockEvent);
    expect(component.sortedData.filteredData.length).toBe(2);
  }
  );

  it('should apply filter ignore led N/A', () => {
    testReq(testset_answer_na);
    const mockEvent: MatCheckboxChange = new MatCheckboxChange ();
    mockEvent.checked = true;

    component.applyIgnoreNA(mockEvent);
    expect(component.sortedData.filteredData.length).toBe(1);
  }
  );

  it('should sort data by name', () => {
    testReq(testset_answer);

    const sort: Sort = { active: 'name', direction: 'asc' };
    component.sortData(sort);
    expect(component.dataSource[0].board).toBe('d1');
    expect(component.dataSource[1].board).toBe('blynk');

  }
  );

  it('should sort data by board asc', () => {
    testReq(testset_answer);
    const sort: Sort = { active: 'board', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].board).toBe('blynk');
    expect(data[1].board).toBe('d1');

  }
  );

  it('should sort data by board desc', () => {
    testReq(testset_answer);
    const sort: Sort = { active: 'board', direction: 'desc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].board).toBe('d1');
    expect(data[1].board).toBe('blynk');
  }
  );

  it('should sort data by led asc', () => {
    testReq(testset_answer);
    const sort: Sort = { active: 'led', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].led).toBe('2');
    expect(data[1].led).toBe('5');
  }
  );

  it('should sort N/A led values at end of list, if direction is asc', () => {
    testReq(testset_answer_na);
    const sort: Sort = { active: 'led', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].led).toBe('2');
    expect(data[1].led).toBe('N/A');
  }
  );

  it('should sort N/A led values at beginning of list, if direction is desc', () => {
    testReq(testset_answer_na + testset_na);
    const sort: Sort = { active: 'led', direction: 'desc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].led).toBe('N/A');
    expect(data[1].led).toBe('N/A');
    expect(data[2].led).toBe('2');
  }
  );

  it('should sort data by led desc', () => {
    testReq(testset_answer);
    const sort: Sort = { active: 'led', direction: 'desc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].led).toBe('5');
    expect(data[1].led).toBe('2');
  }
  );

  it('should sort data by flash_size', () => {
    const csvData = testset_answer + testset_generic;
    testReq(csvData);

    const sort: Sort = { active: 'flash_size', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data.length).toBe(3);
    expect(data[0].flash_size).toBe('[512KB;1MB;2MB;4MB;8MB;16MB]');
    expect(data[1].flash_size).toBe('[4MB]');
    expect(data[2].flash_size).toBe('[8MB]');
  }
  );

  it('should sort data by flash_size na', () => {
    testReq(testset_answer_na);

    const sort: Sort = { active: 'flash_size', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data.length).toBe(2);
    expect(data[0].flash_size).toBe('[N/A]');
    expect(data[1].flash_size).toBe('[4MB]');
  }
  );

   it('should sort data by flash_size desc', () => {
    const csvData = testset_answer + testset_generic;
    testReq(csvData);

    const sort: Sort = { active: 'flash_size', direction: 'desc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data.length).toBe(3);
    expect(data[0].flash_size).toBe('[512KB;1MB;2MB;4MB;8MB;16MB]');
    expect(data[1].flash_size).toBe('[8MB]');
    expect(data[2].flash_size).toBe('[4MB]');
  }
  );

  it('should sort data by mcu asc', () => {
    testReq(testset_answer);
    const sort: Sort = { active: 'mcu', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].mcu).toBe('esp8266a');
    expect(data[1].mcu).toBe('esp8266b');
  }
  );

  it('should sort data by variant asc', () => {
    testReq(testset_answer);
    const sort: Sort = { active: 'variant', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].variant).toBe('d1');
    expect(data[1].variant).toBe('thing');
  }
  );
});
