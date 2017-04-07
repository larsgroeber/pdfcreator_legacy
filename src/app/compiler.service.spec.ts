import { TestBed, inject } from '@angular/core/testing';

import { CompilerService } from './compiler.service';

describe('CompilerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompilerService]
    });
  });

  it('should ...', inject([CompilerService], (service: CompilerService) => {
    expect(service).toBeTruthy();
  }));
});
