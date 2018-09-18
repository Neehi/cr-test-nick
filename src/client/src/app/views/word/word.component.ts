import { Component, Input  } from '@angular/core';

import { UniqueWord } from '../../models';

@Component({
  selector: 'app-word-component',
  templateUrl: './word.component.html',
  styleUrls: [
    './word.component.scss'
  ]
})
export class WordComponent {
    @Input() uniqueWord: UniqueWord;
}
