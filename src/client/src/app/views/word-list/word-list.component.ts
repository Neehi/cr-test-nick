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
    // Prep the terms
    const filterTerms =
      filter
        .trim()
        .split(/[ ,]+/)                     // split into separate terms
        .filter(term => term.length)        // remove any empty strings
        .map(term => (term.toLowerCase()))  // convert to lowercase
        .sort((a, b) => b.length - a.length);

    // Prep the list of words
    const _uniqueWords =
      this._uniqueWords
        .map(uniqueWord => {  // should already be in lowercase but convert it just in case
          return new UniqueWord(uniqueWord.value.toLowerCase(), uniqueWord.num_occurrences);
        });

    // If no terms then simply use the original list
    if (!filterTerms.length) {
      this.uniqueWords = Object.assign([], _uniqueWords);
      return;
    }

    this.uniqueWords =
      _uniqueWords
        .map(uniqueWord => {
          // Get an initial list of matches
          var matches = [];
          filterTerms.forEach(term => {
            for (i = 0; i < uniqueWord.value.length; i++) {
              if (uniqueWord.value.substring(i, i + term.length) == term) {
                matches.push({'start': i, 'end': i + term.length - 1});
              }
            }
          });
          matches.sort((a,b) => a.start - b.start);

          // See if we have any matches
          if (matches && matches.length) {
            // Now build the highlighted string:
            // - for each letter check if it is within a matched range
            // - if char is in a matched range and not currently highlighted then open highlight tag
            // - if char is not in a matched range and is currently hightlighted then close highlight tag
            let highlightedWord = '';
            let highlight = false;
            for (var i=0; i < uniqueWord.value.length; i++) {
              // Use map reduce to check if this position should be highlighted
              if ((matches.reduce((acc, curr) => acc + ((curr.start <= i && curr.end >= i) ? 1 : 0), 0) > 0) != highlight) {
                highlightedWord += '<' + (highlight ? '/' : '') + 'mark>';
                highlight = !highlight;
              }
              highlightedWord += uniqueWord.value.charAt(i);
            }
            if (highlight) highlightedWord += '</mark>';
            return new UniqueWord(
              highlightedWord,
              uniqueWord.num_occurrences
            );
          }
        })
        .filter(Boolean);
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
        this.modalState = 1; // TODO: Use ngx-toastr instead?
      },
      error => {
        this.modalState = 2;
      });
  }
}
