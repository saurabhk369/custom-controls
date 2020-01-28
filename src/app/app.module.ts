import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CustomDatetimepickerModule } from 'custom-datetimepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CustomDatetimepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
