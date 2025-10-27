import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadMapsUsuarioComponent } from './roadmaps-usuario';

describe('RoadmapsUsuario', () => {
  let component: RoadMapsUsuarioComponent;
  let fixture: ComponentFixture<RoadMapsUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadMapsUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoadMapsUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
