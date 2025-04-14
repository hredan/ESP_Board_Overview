import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BoardOverviewComponent } from './board-overview.component';
import { provideHttpClient } from '@angular/common/http';

describe('BoardOverviewComponent', () => {
  let component: BoardOverviewComponent;
  let fixture: ComponentFixture<BoardOverviewComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });

    await TestBed.configureTestingModule({
      imports: [BoardOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardOverviewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('coreName', 'test');
    fixture.detectChanges();
  });

  it('should create', () => {
    const httpTesting = TestBed.inject(HttpTestingController);
    const req = httpTesting.expectOne('./test.csv');
    expect(req.request.method).toEqual('GET');
    req.flush('name,board,led,flash_size\nESP32,ESP32,LED1,4MB\nESP8266,ESP8266,LED2,2MB');
    expect(component).toBeTruthy();
  });
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });
});
