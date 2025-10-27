import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusCursosComponent } from './meus-cursos';

describe('MeusCursos', () => {
  let component: MeusCursosComponent;
  let fixture: ComponentFixture<MeusCursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeusCursosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeusCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
