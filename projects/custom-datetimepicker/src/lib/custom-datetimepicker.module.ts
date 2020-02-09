import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomDatetimepickerComponent } from './custom-datetimepicker.component';

@NgModule({
  declarations: [CustomDatetimepickerComponent],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [CustomDatetimepickerComponent]
})
export class CustomDatetimepickerModule { }
