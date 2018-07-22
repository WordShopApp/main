/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StoreReducer } from './store.reducer';

describe('StoreReducer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreReducer]
    });
  });

  it('should ...', inject([StoreReducer], (service: StoreReducer) => {
    expect(service).toBeTruthy();
  }));
});
