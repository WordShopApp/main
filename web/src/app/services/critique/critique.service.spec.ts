import { TestBed, inject } from '@angular/core/testing';

import { CritiqueService } from './critique.service';

describe('CritiqueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CritiqueService]
    });
  });

  it('should be created', inject([CritiqueService], (service: CritiqueService) => {
    expect(service).toBeTruthy();
  }));
});
