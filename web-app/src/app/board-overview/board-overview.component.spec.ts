import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardOverviewComponent, BoardInfo } from './board-overview.component';
import { Sort } from '@angular/material/sort';
import { MatCheckboxChange } from '@angular/material/checkbox';

const data_lolin: BoardInfo = {
  name: 'LOLIN(WeMos) D1 R1',
  board: 'd1',
  variant: 'd1',
  LED_BUILTIN: '2',
  mcu: 'esp8266a',
  flash_size: '[4MB]',
  linkPins: "https://fake-link.com/blynk-board-pins"
};

const data_blynk: BoardInfo = {
  name: 'SparkFun Blynk Board',
  board: 'blynk',
  variant: 'thing',
  LED_BUILTIN: '5',
  mcu: 'esp8266b',
  flash_size: '[8MB]',
  linkPins: "https://fake-link.com/blynk-board-pins"
};

const data_wifiduino: BoardInfo = {
  name: 'WiFiduino',
  board: 'wifiduino',
  variant: 'wifiduino',
  LED_BUILTIN: 'N/A',
  mcu: 'esp8266',
  flash_size: '[4MB]',
  linkPins: "https://fake-link.com/blynk-board-pins"
};

const data_generic: BoardInfo = {
  name: 'Generic ESP8266 Module',
  board: 'generic',
  variant: 'generic',
  LED_BUILTIN: '1',
  mcu: 'esp8266',
  flash_size: '[512KB;1MB;2MB;4MB;8MB;16MB]',
  linkPins: "https://fake-link.com/blynk-board-pins"
};

const data_lolin_na: BoardInfo = {
  name: 'LOLIN(WeMos) D1 R1',
  board: 'd1',
  variant: 'N/A',
  LED_BUILTIN: 'N/A',
  mcu: 'N/A',
  flash_size: '[N/A]',
  linkPins: "https://fake-link.com/blynk-board-pins"
};

describe('BoardOverviewComponent', () => {
  let component: BoardOverviewComponent;
  let fixture: ComponentFixture<BoardOverviewComponent>;
  const testCoreName = 'esp8266';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
      ],
      imports: [BoardOverviewComponent]
    })
    .compileComponents();

    createComponent();
  });

  function createComponent(dataSource: BoardInfo[] = [data_lolin, data_blynk]) {
    fixture = TestBed.createComponent(BoardOverviewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('coreName', testCoreName);
    fixture.componentRef.setInput('dataSource', dataSource);
    fixture.detectChanges();
  }


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct core name', () => {
    expect(component.coreName()).toEqual(testCoreName);
  });

  it('should render title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain(testCoreName.toUpperCase() + ' Board Overview');
    });

  it('should apply filter', () => {
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
    createComponent([data_lolin, data_wifiduino]);
    const mockEvent: MatCheckboxChange = new MatCheckboxChange ();
    mockEvent.checked = true;

    component.applyIgnoreNA(mockEvent);
    expect(component.sortedData.filteredData.length).toBe(1);
  }
  );

  it('should sort data by name', () => {
    const sort: Sort = { active: 'name', direction: 'asc' };
    component.sortData(sort);
    expect(component.dataSource()[0].board).toBe('d1');
    expect(component.dataSource()[1].board).toBe('blynk');

  }
  );

  it('should sort data by board asc', () => {
    const sort: Sort = { active: 'board', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].board).toBe('blynk');
    expect(data[1].board).toBe('d1');

  }
  );

  it('should sort data by board desc', () => {
    const sort: Sort = { active: 'board', direction: 'desc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].board).toBe('d1');
    expect(data[1].board).toBe('blynk');
  }
  );

  it('should sort data by led asc', () => {
    const sort: Sort = { active: 'led', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].LED_BUILTIN).toBe('2');
    expect(data[1].LED_BUILTIN).toBe('5');
  }
  );

  it('should sort N/A led values at end of list, if direction is asc', () => {
    createComponent([data_lolin_na, data_blynk]);
    const sort: Sort = { active: 'led', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].LED_BUILTIN).toBe('5');
    expect(data[1].LED_BUILTIN).toBe('N/A');
  }
  );

  it('should sort N/A led values at beginning of list, if direction is desc', () => {
    createComponent([data_lolin, data_lolin_na, data_wifiduino]);
    const sort: Sort = { active: 'led', direction: 'desc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].LED_BUILTIN).toBe('N/A');
    expect(data[1].LED_BUILTIN).toBe('N/A');
    expect(data[2].LED_BUILTIN).toBe('2');
  }
  );

  it('should sort data by led desc', () => {
    const sort: Sort = { active: 'led', direction: 'desc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].LED_BUILTIN).toBe('5');
    expect(data[1].LED_BUILTIN).toBe('2');
  }
  );

  it('should sort data by flash_size', () => {
    createComponent([data_lolin, data_blynk, data_generic]);
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
    createComponent([data_lolin_na, data_wifiduino]);
    const sort: Sort = { active: 'flash_size', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data.length).toBe(2);
    expect(data[0].flash_size).toBe('[N/A]');
    expect(data[1].flash_size).toBe('[4MB]');
  }
  );

   it('should sort data by flash_size desc', () => {
    createComponent([data_lolin, data_blynk, data_generic]);
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
    createComponent([data_lolin, data_blynk]);
    const sort: Sort = { active: 'mcu', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].mcu).toBe('esp8266a');
    expect(data[1].mcu).toBe('esp8266b');
  }
  );

  it('should sort data by variant asc', () => {
    createComponent([data_lolin, data_blynk]);
    const sort: Sort = { active: 'variant', direction: 'asc' };
    component.sortData(sort);
    const data: BoardInfo[] = component.sortedData.data.slice();
    expect(data[0].variant).toBe('d1');
    expect(data[1].variant).toBe('thing');
  }
  );
});
