import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UniqueWord } from '../models';
import { UniqueWordsService } from './unique-words.service';

describe('UniqueWordsService', () => {
  let service: UniqueWordsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UniqueWordsService],
    });

    service = TestBed.get(UniqueWordsService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
      httpMock.verify();
  })

  // The tests
  it('should match URL: `/api/unique-word/`', () => {
    service.fetch();

    const req = httpMock.expectOne({ method: 'GET' });
    expect(req.request.url).toMatch('/api/unique-words/');
  });

  it('should get a list of words from the API', done => {
    const data = [{ value: 'test', num_occurrences: 1}];

    service.fetch();

    const req = httpMock.expectOne({ method: 'GET' });
    expect(req.request.url).toMatch('/api/unique-words/');
    req.flush(data);

    service
      .uniqueWords$
      .subscribe(received => {
        expect(received).toEqual([new UniqueWord(data[0].value, data[0].num_occurrences)]);
        done();
      });
  });

  it('should post a new sentence to the API', () => {
    service
      .addWords('This is a test')
      .subscribe(() => {});

    const req = httpMock.expectOne({ method: 'POST' });
    expect(req.request.url).toMatch('/api/unique-words/');
    expect(req.request.body).toEqual('This is a test');
  });
});
