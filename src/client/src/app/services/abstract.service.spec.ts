import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AbstractService } from './abstract.service';

describe('Service: AbstractService', () => {
  let service: AbstractService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AbstractService],
    });

    service = TestBed.get(AbstractService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return http client', () => {
    expect(service.client()).toEqual(service['http']);
  });

  describe('get', () => {
    it('should use `GET` method', () => {
      service.get('/test/').subscribe();
      const req = httpMock.expectOne({ method: 'GET' });
    });

    it('should have json response type', () => {
      service.get('/test/').subscribe();
      const req = httpMock.expectOne({ method: 'GET' });
      expect(req.request.responseType).toEqual('json');
    });

    it('should return data', () => {
      const data = 'test';

      service.get('/test/').subscribe(
        data => {
          expect(data).toEqual('test');
        });

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(data);
    });

    it('should not send data', () => {
      service.get('/test/').subscribe();
      const req = httpMock.expectOne({ method: 'GET' });
      expect(req.request.body).toBeFalsy();
    });
  });

  describe('post', () => {
    it('should use `POST` method', () => {
      service.post('/test/', '').subscribe();
      const req = httpMock.expectOne({ method: 'POST' });
    });

    it('should have json response type', () => {
      service.post('/test/', '').subscribe();
      const req = httpMock.expectOne({ method: 'POST' });
      expect(req.request.responseType).toEqual('json');
    });

    it('should send data', () => {
      service.post('/test/', 'This is a test').subscribe();
      const req = httpMock.expectOne({ method: 'POST' });
      expect(req.request.body).toEqual('This is a test');
    });
  });

  describe('put', () => {
    it('should use `PUT` method', () => {
      service.put('/test/', '').subscribe();
      const req = httpMock.expectOne({ method: 'PUT' });
    });

    it('should have json response type', () => {
      service.put('/test/', '').subscribe();
      const req = httpMock.expectOne({ method: 'PUT' });
      expect(req.request.responseType).toEqual('json');
    });

    it('should send data', () => {
      service.put('/test/', 'This is a test').subscribe();
      const req = httpMock.expectOne({ method: 'PUT' });
      expect(req.request.body).toEqual('This is a test');
    });
  });

  describe('patch', () => {
    it('should use `PATCH` method', () => {
      service.patch('/test/', '').subscribe();
      const req = httpMock.expectOne({ method: 'PATCH' });
    });

    it('should have json response type', () => {
      service.patch('/test/', '').subscribe();
      const req = httpMock.expectOne({ method: 'PATCH' });
      expect(req.request.responseType).toEqual('json');
    });

    it('should send data', () => {
      service.patch('/test/', 'This is a test').subscribe();
      const req = httpMock.expectOne({ method: 'PATCH' });
      expect(req.request.body).toEqual('This is a test');
    });
  });

  describe('delete', () => {
    it('should use `DELETE` method', () => {
      service.delete('/test/').subscribe();
      const req = httpMock.expectOne({ method: 'DELETE' });
    });

    it('should have json response type', () => {
      service.delete('/test/').subscribe();
      const req = httpMock.expectOne({ method: 'DELETE' });
      expect(req.request.responseType).toEqual('json');
    });

    it('should not send data', () => {
      service.delete('/test/').subscribe();
      const req = httpMock.expectOne({ method: 'DELETE' });
      expect(req.request.body).toBeFalsy();
    });
  });
});
