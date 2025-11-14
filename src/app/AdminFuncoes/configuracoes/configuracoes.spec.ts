import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaComponent } from './configuracoes'; // Alterado

describe('EmpresaComponent', () => {
  // Alterado
  let component: EmpresaComponent; // Alterado
  let fixture: ComponentFixture<EmpresaComponent>; // Alterado

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaComponent], // Alterado
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresaComponent); // Alterado
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});