import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { RecordWithRefComponent } from './record-with-ref/record-with-ref.component';
import { RecordWithoutRefComponent } from './record-without-ref/record-without-ref.component';

@NgModule({
  declarations: [
    AppComponent,
    RecordWithRefComponent,
    RecordWithoutRefComponent,
  ],
  imports: [BrowserModule, FormsModule, GraphQLModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
