import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateListComponent } from './plate-list.component';

describe('PlateListComponent', () => {
  let component: PlateListComponent;
  let fixture: ComponentFixture<PlateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
