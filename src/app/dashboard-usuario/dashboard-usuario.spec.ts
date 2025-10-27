import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUsuarioComponent } from './dashboard-usuario';

describe('DashboardUsuario', () => {
  let component: DashboardUsuarioComponent;
  let fixture: ComponentFixture<DashboardUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
