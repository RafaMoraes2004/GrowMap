import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Feedback } from './feedback';

describe('Feedback', () => {
  let component: Feedback;
  let fixture: ComponentFixture<Feedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Feedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Feedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
