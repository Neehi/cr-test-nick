import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  template: `
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--12-col">
        <h2>Oops!</h2>
        <h3>Page Not Found.</h3>
        <button class="mdl-button mdl-js-button mdl-button--raised" (click)="goBack()">Go Back</button>
      </div>
    </div>`
})
export class PageNotFoundComponent {
  constructor(
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }
}
