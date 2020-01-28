import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cc-custom-datetimepicker',
  templateUrl: './custom-datetimepicker.component.html',
  styleUrls: ['./custom-datetimepicker.component.scss'],
  styles: []
})
export class CustomDatetimepickerComponent implements OnInit {

  @Input() defaultDate: string;

  constructor() { }

  ngOnInit() {
    console.log(this.defaultDate);
  }

  isValidDate(value: string) {
    // regular expression to match
  }

}
