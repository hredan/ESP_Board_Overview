import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Esp32BoardOverviewComponent } from './esp32-board-overview.component';

describe('Esp32BoardOverviewComponent', () => {
  let component: Esp32BoardOverviewComponent;
  let fixture: ComponentFixture<Esp32BoardOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Esp32BoardOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Esp32BoardOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
