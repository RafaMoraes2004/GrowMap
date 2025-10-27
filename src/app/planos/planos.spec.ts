import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Planos } from './planos';

describe('Planos', () => {
  let component: Planos;
  let fixture: ComponentFixture<Planos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Planos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Planos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
