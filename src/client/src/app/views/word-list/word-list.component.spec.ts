import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { of } from 'rxjs';

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
    uniqueWordsServiceSpy = jasmine.createSpyObj('UniqueWordsService', ['getWords', 'addWords']);
    (uniqueWordsServiceSpy.getWords as jasmine.Spy).and.returnValue(of([]));
    (uniqueWordsServiceSpy.addWords as jasmine.Spy).and.returnValue(of(null));

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
      expect(compiled.querySelector('.filter-panel')).toBeTruthy();
      expect(compiled.querySelector('.filter-panel .filter')).toBeTruthy();
    }));

    it('should call `filterBy` on button click', async(() => {
      component.uniqueWords = someUniqueWords;
      fixture.detectChanges();
      spyOn(component, 'filterBy');
      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('.filter .btn').click();
      fixture.whenStable().then(() => {
        expect(component.filterBy).toHaveBeenCalled();
      });
    }));
  });

  describe('Sort panel', () => {
    it('should not render sort panel if no unique words', async(() => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.sort-panel')).toBeFalsy();
    }));

    it('should render sort panel if has unique words', async(() => {
      component.uniqueWords = someUniqueWords;
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.sort-panel #sort-by-value')).toBeTruthy();
      expect(compiled.querySelector('.sort-panel #sort-by-value').textContent).toContain('Word');
      expect(compiled.querySelector('.sort-panel #sort-by-occurrence')).toBeTruthy();
      expect(compiled.querySelector('.sort-panel #sort-by-occurrence').textContent).toContain('Occurrence');
    }));

    it('should call `sortBy` on button click', async(() => {
      component.uniqueWords = someUniqueWords;
      fixture.detectChanges();
      spyOn(component, 'sortBy');
      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('#sort-by-value').click();
      compiled.querySelector('#sort-by-occurrence').click();
      fixture.whenStable().then(() => {
        expect(component.sortBy).toHaveBeenCalled(); // .exactly(2).times(); // TODO: Fix?
      });
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
    it('should not highlight on no filter', async(() => {
      (component as any)._uniqueWords = someUniqueWords;
      component.filterBy('');
      fixture.detectChanges();
      expect(component.uniqueWords[0].value).toEqual('test');
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('app-word-component .panel-title').innerHTML).toBe('aaa');
    }));

    it('should highlight on filter', async(() => {
      (component as any)._uniqueWords = someUniqueWords;
      component.filterBy('test');
      fixture.detectChanges();
      expect(component.uniqueWords[0].value).toEqual('<mark>test</mark>');
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('app-word-component .panel-title').innerHTML).toBe('<mark>test</mark>');
    }));

    it('should merge overlapping highlights', async(() => {
      (component as any)._uniqueWords = someUniqueWords;
      component.filterBy('aa');
      fixture.detectChanges();
      expect(component.uniqueWords[0].value).toEqual('<mark>aaa</mark>'); // {aa}a & a{aa}
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('app-word-component .panel-title').innerHTML).toBe('<mark>aaa</mark>');
    }));

    it('should filter on exact match', async(() => {
      (component as any)._uniqueWords = someUniqueWords;
      component.filterBy('test');
      fixture.detectChanges();
      expect(component.uniqueWords).toEqual([new UniqueWord('<mark>test</mark>', 1)]);
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('app-word-component .panel-title').length).toEqual(1);
      expect(compiled.querySelector('app-word-component .panel-title').textContent).toBe('test');
    }));

    it('should filter on partial match', async(() => {
      (component as any)._uniqueWords = someUniqueWords;
      component.filterBy('es');
      fixture.detectChanges();
      expect(component.uniqueWords).toEqual([new UniqueWord('t<mark>es</mark>t', 1)]);
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('app-word-component').length).toEqual(1);
      expect(compiled.querySelector('app-word-component .panel-title').textContent).toBe('test');
    }));

    it('should filter on multiple matches', async(() => {
      (component as any)._uniqueWords = someUniqueWords;
      component.filterBy('es aa');
      fixture.detectChanges();
      expect(component.uniqueWords).toEqual([new UniqueWord('t<mark>es</mark>t', 1), new UniqueWord('<mark>aaa</mark>', 2)]);
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('app-word-component .panel-title').length).toEqual(2);
      expect(compiled.querySelectorAll('app-word-component .panel-title')[0].textContent).toBe('aaa');
      expect(compiled.querySelectorAll('app-word-component .panel-title')[1].textContent).toBe('test');
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

  describe('Add Words Modal', () => {
    it('should be hidden by default', async(() => {
      expect(component.isModalActive).toEqual(false);
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('#add-words-modal.active')).toBeFalsy();
    }));

    it('should be shown when `isModalActive` is true', async(() => {
      component.isModalActive = true;
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('#add-words-modal.active')).toBeTruthy();
    }));

    it('should be hidden when `isModalActive` is false', async(() => {
      component.isModalActive = true;
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('#add-words-modal.active')).toBeTruthy();
      component.isModalActive = false;
      fixture.detectChanges();
      expect(compiled.querySelector('#add-words-modal.active')).toBeFalsy();
    }));

    it('should be shown when `showModal` is called', async(() => {
      component.showModal();
      fixture.detectChanges();
      expect(component.isModalActive).toEqual(true);
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('#add-words-modal.active')).toBeTruthy();
    }));

    it('should be hidden when `closeModal` is called', async(() => {
      component.showModal();
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('#add-words-modal.active')).toBeTruthy();
      component.closeModal();
      fixture.detectChanges();
      expect(compiled.querySelector('#add-words-modal.active')).toBeFalsy();
    }));

    it('should show form with modal state 0', async(() => {
      component.showModal();
      fixture.detectChanges();
      expect(component.modalState).toEqual(0);
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('#add-words-modal.active form')).toBeTruthy();
    }));

    it('should show success message when modal state is 1', async(() => {
      component.showModal();
      component.modalState = 1;
      fixture.detectChanges();
      expect(component.modalState).toEqual(1);
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('#add-words-modal.active form')).toBeFalsy();
      expect(compiled.querySelector('#add-words-modal.active .modal-body p').textContent).toContain('Success!');
    }));

    it('should show error message when modal state is 2', async(() => {
      component.showModal();
      component.modalState = 2;
      fixture.detectChanges();
      expect(component.modalState).toEqual(2);
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('#add-words-modal.active form')).toBeFalsy();
      expect(compiled.querySelector('#add-words-modal.active .modal-body p').textContent).toContain('Oops!');
    }));

    it('should call `closeModal` on clicking overlay', async(() => {
      component.showModal();
      fixture.detectChanges();
      spyOn(component, 'closeModal');
      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('.modal-overlay').click();
      fixture.whenStable().then(() => {
        expect(component.closeModal).toHaveBeenCalled();
      });
    }));

    it('should call `closeModal` on button click', async(() => {
      component.showModal();
      fixture.detectChanges();
      spyOn(component, 'closeModal');
      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('.modal-header button').click();
      compiled.querySelector('.modal-footer button.btn-link').click();
      fixture.whenStable().then(() => {
        expect(component.closeModal).toHaveBeenCalled();
      });
    }));

    it('should call `addWords` on button click', async(() => {
      component.showModal();
      fixture.detectChanges();
      spyOn(component, 'addWords');
      const compiled = fixture.debugElement.nativeElement;
      compiled.querySelector('.modal-header button').click();
      compiled.querySelector('.modal-footer button.btn-primary').click();
      fixture.whenStable().then(() => {
        expect(component.addWords).toHaveBeenCalled();
      });
    }));
  });
});
