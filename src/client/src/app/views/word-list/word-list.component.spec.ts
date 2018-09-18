import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'

import { ReplaySubject } from 'rxjs';

import { UniqueWord } from '../../models';
import { UniqueWordsService } from '../../services';

import { WordListComponent } from './word-list.component';

describe('WordListComponent', () => {
  let component: WordListComponent;
  let fixture: ComponentFixture<WordListComponent>;
  let uniqueWordsServiceSpy: UniqueWordsService;
  const uniqueWordSubject = new ReplaySubject<UniqueWord[]>(1);
  const uniqueWords = [new UniqueWord('test', 1), new UniqueWord('another', 1)];

  beforeEach(async(() => {
    uniqueWordsServiceSpy = jasmine.createSpyObj('UniqueWordsService', ['fetch']);
    uniqueWordsServiceSpy.uniqueWords$ = uniqueWordSubject.asObservable();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [WordListComponent],
      providers: [{ provide: UniqueWordsService, useValue: uniqueWordsServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // TODO: Revisit to fix test - elements not being picked up properly
  // it('should render an empty state if no unique words', async(() => {
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   console.log("1", compiled.querySelector('.empty p'));
  //   expect(compiled.querySelector('.empty p')).toBeTruthy();
  //   expect(compiled.querySelector('.empty p').textContent).toContain('There are no words here yet :(');
  // }));

  it('should not render word components if no unique words', async(() => {
    component = fixture.componentInstance;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    console.log("2", compiled.querySelector('app-word-component'));
    expect(compiled.querySelector('app-word-component')).toBeFalsy();
  }));

  it('should not render an empty state if has unique words', async(() => {
    uniqueWordSubject.next(uniqueWords);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    console.log("3", compiled.querySelector('.empty p'));
    expect(compiled.querySelector('.empty p')).toBeFalsy();
  }));

  it('should render word components if has unique words', async(() => {
    uniqueWordSubject.next(uniqueWords);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    console.log("4", compiled.querySelector('app-word-component'));
    expect(compiled.querySelector('app-word-component')).toBeTruthy();
  }));
});
