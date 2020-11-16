import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularMaterialLiteComponent } from './angular-material-lite.component';

describe('AngularMaterialLiteComponent', () => {
  let component: AngularMaterialLiteComponent;
  let fixture: ComponentFixture<AngularMaterialLiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularMaterialLiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularMaterialLiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
