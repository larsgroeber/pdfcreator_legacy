import { TestBed, inject } from '@angular/core/testing';

import { LatexService } from './latex.service';

describe('LatexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LatexService]
    });
  });

  it('should ...', inject([LatexService], (service: LatexService) => {
    expect(service).toBeTruthy();
  }));
});
