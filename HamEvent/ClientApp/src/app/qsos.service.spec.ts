import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { QSOsService } from './qsos.service';

describe('QSOsService', () => {
  let service: QSOsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: 'BASE_URL', useValue: 'http://localhost/' }]
    });
    service = TestBed.inject(QSOsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
