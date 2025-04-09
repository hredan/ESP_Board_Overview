import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Esp8266BoardOverviewComponent } from './esp8266-board-overview.component';

describe('Esp8266BoardOverviewComponent', () => {
  let component: Esp8266BoardOverviewComponent;
  let fixture: ComponentFixture<Esp8266BoardOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Esp8266BoardOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Esp8266BoardOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
