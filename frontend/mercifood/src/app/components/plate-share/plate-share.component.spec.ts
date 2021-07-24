import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateShareComponent } from './plate-share.component';

describe('PlateComponent', () => {
  let component: PlateShareComponent;
  let fixture: ComponentFixture<PlateShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlateShareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlateShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
