import { TestBed } from '@angular/core/testing';

import { QSOsService } from './qsos.service';

describe('QSOsService', () => {
  let service: QSOsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QSOsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
