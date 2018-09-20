import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OrderPipe } from 'ngx-order-pipe';

import { UniqueWord } from '../../models';
import { UniqueWordsService } from '../../services';

@Component({
  templateUrl: './word-list.component.html',
  styleUrls: [
    './word-list.component.scss'
  ]
})
export class WordListComponent implements OnInit {
  private _uniqueWords: UniqueWord[]; // Original
  uniqueWords: UniqueWord[]; // Filtered list

  sortProperty: string;
  sortReverse: boolean;

  filterTerm: string;
  sentence: string;

  isModalActive: boolean = false;
  modalState: number = 0; // TODO: Use proper states

  constructor(
    private service: UniqueWordsService,
    private route: ActivatedRoute,
    private orderPipe: OrderPipe,
  ) {}

  ngOnInit() {
    this.filterTerm = '';
    this.sortProperty = 'value';
    this.sortReverse = false; // Ascending by default
    this.getWords();
  }

  getWords() {
    this.service.getWords()
      .subscribe(data => {
        if (data !== undefined && data !== null) {
          this._uniqueWords = data.map(rawUniqueWord => new UniqueWord(rawUniqueWord.value, rawUniqueWord.num_occurrences));
        }
        this.filterBy(this.filterTerm);
        this.orderPipe.transform(this.uniqueWords, this.sortProperty, this.sortReverse);
      });
  }

  filterBy(filter: string) {
    if (filter !== '') {
      const filterTerms = filter.toLowerCase().split(/[ ,]+/);
      this.uniqueWords = this._uniqueWords.filter(uniqueWord => {
        for (var i=0; i < filterTerms.length; i++){
          if (uniqueWord.value.toLowerCase().indexOf(filterTerms[i]) > -1) {
            return true;
          }
        }
        return false;
      });
    } else {
      this.uniqueWords = Object.assign([], this._uniqueWords);
    }
  }

  sortBy(property: string) {
    this.sortReverse = this.sortProperty == property ? !this.sortReverse : false;
    this.sortProperty = property;
  }

  showModal() {
    this.isModalActive = true;
    this.modalState = 0;
  }

  closeModal() {
    this.isModalActive = false;
    this.modalState = 0;
  }

  addWords(sentence: string) {
    this.service
      .addWords(sentence)
      .subscribe(data => {
        this.getWords();
        this.modalState = 1; // Use ngx-toastr instead?
      },
      error => {
        this.modalState = 2;
      });
  }
}
