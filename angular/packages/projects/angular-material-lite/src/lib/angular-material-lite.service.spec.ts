import { TestBed } from '@angular/core/testing';

import { AngularMaterialLiteService } from './angular-material-lite.service';

describe('AngularMaterialLiteService', () => {
  let service: AngularMaterialLiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularMaterialLiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
