import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './views/main.component';
import { WordListComponent } from './views/word-list/word-list.component';

import { PageNotFoundComponent } from './not-found.component';

export const routes: Routes = [
  { path: '', component: WordListComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true }
    ),
  ],
  exports: [
    RouterModule,
  ],
})

export class AppRoutingModule {}
