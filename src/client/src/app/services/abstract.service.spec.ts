import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AbstractService } from './abstract.service';

describe('Service: AbstractService', () => {
  let service: AbstractService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AbstractService],
      imports: [HttpClientTestingModule],
    });
  });

  beforeEach(() => {
    service = TestBed.get(AbstractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
