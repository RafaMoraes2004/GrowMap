import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuporteEmpresaComponent } from './adminsup'; // Alterado

describe('SuporteEmpresaComponent', () => {
  // Alterado
  let component: SuporteEmpresaComponent; // Alterado
  let fixture: ComponentFixture<SuporteEmpresaComponent>; // Alterado

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuporteEmpresaComponent], // Alterado
    }).compileComponents();

    fixture = TestBed.createComponent(SuporteEmpresaComponent); // Alterado
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});