import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardOverviewComponent } from './board-overview.component';

describe('BoardOverviewComponent', () => {
  let component: BoardOverviewComponent;
  let fixture: ComponentFixture<BoardOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
