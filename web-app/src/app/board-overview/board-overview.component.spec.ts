import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting, TestRequest } from '@angular/common/http/testing';

import { BoardOverviewComponent } from './board-overview.component';
import { provideHttpClient } from '@angular/common/http';

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

});
