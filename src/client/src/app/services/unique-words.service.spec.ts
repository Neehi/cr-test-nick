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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWords', () => {
    it('should match URL: `/api/unique-word/`', () => {
    service.getWords()
      .subscribe(data => {
      });

      const req = httpMock.expectOne({ method: 'GET' });
      expect(req.request.url).toMatch('/api/unique-words/');
    });

    it('should get a list of words from the API', () => {
      const data = [{value: 'test', num_occurrences: 1}, {value: 'AAA', num_occurrences: 2}];

      service.getWords()
        .subscribe(data => {
          expect(data.length).toBe(2);
          expect(data[0].value).toBe('test');
          expect(data[0].num_occurrences).toBe(1);
          expect(data[1].value).toBe('AAA');
          expect(data[1].num_occurrences).toBe(2);
        });

      const req = httpMock.expectOne({ method: 'GET' });
      expect(req.request.url).toMatch('/api/unique-words/');
      req.flush(data);
    });
  });

  describe('addWords', () => {
    it('should match URL: `/api/unique-word/`', () => {
    service.addWords('This is a test')
      .subscribe(data => {
      });

      const req = httpMock.expectOne({ method: 'POST' });
      expect(req.request.url).toMatch('/api/unique-words/');
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
});
