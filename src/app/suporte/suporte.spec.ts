import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuporteComponent } from './suporte'; // Alterado

describe('Suporte', () => {
  // Alterado
  let component: SuporteComponent; // Alterado
  let fixture: ComponentFixture<SuporteComponent>; // Alterado

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuporteComponent], // Alterado
    }).compileComponents();

    fixture = TestBed.createComponent(SuporteComponent); // Alterado
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});