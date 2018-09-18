import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { UniqueWord } from '../../models';
import { UniqueWordsService } from '../../services';

@Component({
  templateUrl: './word-list.component.html',
  styleUrls: [
    './word-list.component.scss'
  ]
})
export class WordListComponent implements OnInit, OnChanges {
  uniqueWords$: Observable<UniqueWord[]>;

  constructor(
    private service: UniqueWordsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.uniqueWords$ = this.service.uniqueWords$;

    this.service.fetch();
  }

  ngOnChanges() {

  }
}
