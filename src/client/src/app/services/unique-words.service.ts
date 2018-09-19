import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { UniqueWord, RawUniqueWord } from '../models';
import { AbstractService } from './abstract.service';

const API_URL = '/api/unique-words/';

@Injectable()
export class UniqueWordsService extends AbstractService {
  uniqueWords$: Observable<UniqueWord[]>;

  private uniqueWordSubject = new ReplaySubject<UniqueWord[]>(1);
  private url = `${API_URL}`;

  constructor(http: HttpClient) {
    super(http);
    this.uniqueWords$ = this.uniqueWordSubject.asObservable();
  }

  private deserialise(rawUniqueWords: RawUniqueWord[]): UniqueWord[] {
    return rawUniqueWords.map(rawUniqueWord => new UniqueWord(rawUniqueWord.value, rawUniqueWord.num_occurrences));
  }

  // [GET] /api/unique-words/
  fetch() {
    this.get(this.url)
      .subscribe(data => {
        this.uniqueWordSubject.next(this.deserialise(data));
      });
  }

  getWords(): Observable<any> {
    return this.get(this.url);
  }

  // [POST] /api/unique-words/
  addWords(sentence: string): Observable<any> {
    return this.post(this.url, sentence);
  }
}
