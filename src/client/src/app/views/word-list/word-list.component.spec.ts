import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'
import { FormsModule } from '@angular/forms';

import { of } from 'rxjs'

import { OrderModule } from 'ngx-order-pipe';

import { UniqueWord } from '../../models';
import { UniqueWordsService } from '../../services';

import { WordListComponent } from './word-list.component';
import { WordComponent } from '../word/word.component';

describe('WordListComponent', () => {
  let component: WordListComponent;
  let fixture: ComponentFixture<WordListComponent>;
  let uniqueWordsServiceSpy: UniqueWordsService;

  const someUniqueWords = [new UniqueWord('test', 1), new UniqueWord('AAA', 2)];

  beforeEach(async(() => {
    uniqueWordsServiceSpy = jasmine.createSpyObj('UniqueWordsService', ['getWords']);
    (uniqueWordsServiceSpy.getWords as jasmine.Spy).and.returnValue(of(null));

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        OrderModule,
      ],
      declarations: [
        WordListComponent,
        WordComponent,
      ],
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
    expect(component).toBeTruthy();
  });

  describe('Empty state', () => {
    it('should render an empty state if no unique words', async(() => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.empty p')).toBeTruthy();
      expect(compiled.querySelector('.empty p').textContent).toContain('There are no words here yet :(');
    }));

    it('should not render an empty state if has unique words', async(() => {
      component.uniqueWords = someUniqueWords;
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.empty p')).toBeFalsy();
    }));
  });

  describe('Filter panel', () => {
    it('should not render filter panel if no unique words', async(() => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.filter-panel')).toBeFalsy();
    }));

    it('should render filter panel if has unique words', async(() => {
      component.uniqueWords = someUniqueWords;
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.filter-panel .filter')).toBeTruthy();
      expect(compiled.querySelector('.filter-panel #sort-by-name')).toBeTruthy();
      expect(compiled.querySelector('.filter-panel #sort-by-name').textContent).toContain('Name');
      expect(compiled.querySelector('.filter-panel #sort-by-occurrence')).toBeTruthy();
      expect(compiled.querySelector('.filter-panel #sort-by-occurrence').textContent).toContain('Occurrence');
    }));

    it('should call `filter` on button click', async(() => {
      component.uniqueWords = someUniqueWords;
      fixture.detectChanges();
      spyOn(component, 'filterBy');
      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('.filter .btn').click();
      fixture.whenStable().then(() => {
        expect(component.filterBy).toHaveBeenCalled();
      })
    }));

    it('should call `sortBy` on button click', async(() => {
      component.uniqueWords = someUniqueWords;
      fixture.detectChanges();
      spyOn(component, 'sortBy');
      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('#sort-by-name').click();
      compiled.querySelector('#sort-by-occurrence').click();
      fixture.whenStable().then(() => {
        expect(component.sortBy).toHaveBeenCalled(); //.exactly(2).times(); // TODO: Fix?
      })
    }));
  });

  describe('Word components', () => {
    it('should not render word components if no unique words', async(() => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('app-word-component')).toBeFalsy();
    }));

    it('should render word components if has unique words', async(() => {
      component.uniqueWords = someUniqueWords;
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('app-word-component')).toBeTruthy();
    }));
  });

  describe('Filter', () => {
    it('should filter on exact match', async(() => {
      (component as any)._uniqueWords = someUniqueWords;
      component.filterBy('test');
      fixture.detectChanges();
      expect(component.uniqueWords).toEqual([new UniqueWord('test', 1)]);
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('app-word-component').length).toEqual(1);
      expect(compiled.querySelector('app-word-component .panel-title').textContent).toContain('test');
    }));

    it('should filter on partial match', async(() => {
      (component as any)._uniqueWords = someUniqueWords;
      component.filterBy('es');
      fixture.detectChanges();
      expect(component.uniqueWords).toEqual([new UniqueWord('test', 1)]);
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('app-word-component').length).toEqual(1);
      expect(compiled.querySelector('app-word-component .panel-title').textContent).toContain('test');
    }));

    it('should filter on multiple matches', async(() => {
      (component as any)._uniqueWords = someUniqueWords;
      component.filterBy('es aa');
      fixture.detectChanges();
      expect(component.uniqueWords).toEqual(someUniqueWords);
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('app-word-component').length).toEqual(2);
      expect(compiled.querySelectorAll('app-word-component .panel-title')[0].textContent).toContain('AAA');
      expect(compiled.querySelectorAll('app-word-component .panel-title')[1].textContent).toContain('test');
    }));
  });

  describe('Sort', () => {
    it('should sort by `value` ascending', async(() => {
      component.uniqueWords = someUniqueWords;
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('app-word-component .panel-title').textContent).toContain('AAA');
    }));

    it('should sort by `value` descending', async(() => {
      component.uniqueWords = someUniqueWords;
      component.sortBy('value');
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('app-word-component .panel-title').textContent).toContain('test');
    }));

    it('should sort by `num_occurrences` ascending', async(() => {
      component.uniqueWords = someUniqueWords;
      component.sortBy('num_occurrences');
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('app-word-component .panel-title').textContent).toContain('test');
    }));

    it('should sort by `num_occurrences` descending', async(() => {
      component.uniqueWords = someUniqueWords;
      component.sortBy('num_occurrences');
      component.sortBy('num_occurrences');
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('app-word-component .panel-title').textContent).toContain('AAA');
    }));
  });
});
