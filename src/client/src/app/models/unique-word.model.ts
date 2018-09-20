import { RawUniqueWord } from './raw.unique-word.model';

// Our representaion of the model
export class UniqueWord extends RawUniqueWord {
  constructor(value: string, occurrences: number) {
    super();

    this.value = value;
    this.num_occurrences = occurrences;
  }
}
