import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { UniqueWordsService } from './services';

import { AppComponent } from './app.component';
import { MainComponent } from './views/main.component';
import { WordListComponent } from './views/word-list/word-list.component';
import { WordComponent } from './views/word/word.component';

import { PageNotFoundComponent } from './not-found.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    MainComponent,
    WordListComponent,
    WordComponent,
    PageNotFoundComponent,
  ],
  providers: [
    UniqueWordsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
