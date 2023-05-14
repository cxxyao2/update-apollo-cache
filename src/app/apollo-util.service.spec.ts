import { TestBed } from '@angular/core/testing';

import { ApolloUtilService } from './apollo-util.service';

describe('ApolloUtilService', () => {
  let service: ApolloUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApolloUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
