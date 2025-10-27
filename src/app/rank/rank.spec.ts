import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankComponent} from './rank';

describe('Rank', () => {
  let component: RankComponent;
  let fixture: ComponentFixture<RankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
