import { TestBed, inject } from '@angular/core/testing';

import { WordIconService } from './word-icon.service';

describe('WordIconService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordIconService]
    });
  });

  it('should be created', inject([WordIconService], (service: WordIconService) => {
    expect(service).toBeTruthy();
  }));
});
