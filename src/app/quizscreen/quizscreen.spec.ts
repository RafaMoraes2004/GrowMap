import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Quizscreen } from './quizscreen';

describe('Quizscreen', () => {
  let component: Quizscreen;
  let fixture: ComponentFixture<Quizscreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Quizscreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Quizscreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
