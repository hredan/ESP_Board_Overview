import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { Esp8266BoardOverviewComponent } from './esp8266-board-overview.component';
import { BoardOverviewComponent } from '../board-overview/board-overview.component';
import { By } from '@angular/platform-browser';

describe('Esp8266BoardOverviewComponent', () => {
  let component: Esp8266BoardOverviewComponent;
  let fixture: ComponentFixture<Esp8266BoardOverviewComponent>;
  let boardOverview: BoardOverviewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Esp8266BoardOverviewComponent, MockComponent(BoardOverviewComponent)],
      imports: [Esp8266BoardOverviewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(Esp8266BoardOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const boardOverviewComponent = fixture.debugElement.query(By.directive(BoardOverviewComponent));
    boardOverview = boardOverviewComponent.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('rendered board overview component', () => {
    expect(boardOverview).toBeTruthy();
  });

  it('should set the board type to ESP8266', () => {
    expect(boardOverview.coreName).toEqual('esp8266');
  });
});
