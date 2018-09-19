import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UniqueWord, RawUniqueWord } from '../models';
import { AbstractService } from './abstract.service';

const API_URL = '/api/unique-words/';

@Injectable()
export class UniqueWordsService extends AbstractService {
  private url = `${API_URL}`;

  // [GET] /api/unique-words/
  getWords(): Observable<any> {
    return this.get(this.url);
  }

  // [POST] /api/unique-words/
  addWords(sentence: string): Observable<any> {
    return this.post(this.url, sentence);
  }
}
