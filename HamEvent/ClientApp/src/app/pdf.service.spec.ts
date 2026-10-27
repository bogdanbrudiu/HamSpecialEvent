import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PdfService } from './pdf.service';

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: 'BASE_URL', useValue: 'http://localhost/' }]
    });
    service = TestBed.inject(PdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
