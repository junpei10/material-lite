/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DocsRouteNavComponent } from './docs-route-nav.component';

describe('DocsRouteNavComponent', () => {
  let component: DocsRouteNavComponent;
  let fixture: ComponentFixture<DocsRouteNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsRouteNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsRouteNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
