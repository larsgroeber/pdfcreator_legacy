import { TestBed, inject } from '@angular/core/testing';

import { APIService } from './api.service';

describe('LatexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [APIService]
    });
  });

  it('should ...', inject([APIService], (service: APIService) => {
    expect(service).toBeTruthy();
  }));
});
