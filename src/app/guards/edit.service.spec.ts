import { TestBed, inject } from '@angular/core/testing';

import { EditGuard } from './edit.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditGuard]
    });
  });

  it('should ...', inject([EditGuard], (service: EditGuard) => {
    expect(service).toBeTruthy();
  }));
});
