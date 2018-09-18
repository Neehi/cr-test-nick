import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { UniqueWord } from '../../models';

import { WordComponent } from './word.component';

describe('WordComponent', () => {
  let component: WordComponent;
  let fixture: ComponentFixture<WordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WordComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    setInputData(new UniqueWord('test', 1));
    expect(component).toBeDefined();
  });

  function setInputData(uniqueWord: UniqueWord) {
    component.uniqueWord = uniqueWord;
    return fixture.detectChanges();
  }
});
