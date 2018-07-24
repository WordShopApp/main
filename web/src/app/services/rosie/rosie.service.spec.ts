import { TestBed, inject } from '@angular/core/testing';

import { RosieService } from './rosie.service';

describe('RosieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RosieService]
    });
  });

  it('should be created', inject([RosieService], (service: RosieService) => {
    expect(service).toBeTruthy();
  }));
});
