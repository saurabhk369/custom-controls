import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'custom-controls';

  @ViewChild('CalendarWrapper', { static: true }) CW: ElementRef<HTMLDivElement>;

  view = 'calendar';

  dateValidations = ['year', 'month', 'day', 'hours', 'minutes', 'seconds', 'milliseconds'];
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  currentDay: number;
  currentDate: number;
  currentMonth: number;
  currentYear: number;
  currentHours: number;
  currentMinutes: number;
  currentSeconds: number;
  currentMilliseconds: number;

  selectedDay: number;
  selectedDate: number;
  selectedMonth: number;
  selectedYear: number;
  selectedHours: number;
  selectedMinutes: number;
  selectedSeconds: number;
  selectedMilliseconds: number;

  decadeStartYear: number;
  decadeEndYear: number;
  YearsInDecade = [];

  // defaultDate = '16-Jan-1994 01:05 AM';
  defaultDate;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    const date = this.defaultDate ? moment(this.defaultDate).format('DD-MMMYYYY') : moment().format('DD-MMM-YYYY');
    if (date) {
      if (this.isValidDate(date)) {
        // console.log(date);
        this.currentDay = parseInt(moment(date).format('d'), 10);
        // console.log(this.days[this.currentDay]);
        this.currentDate = parseInt(moment(date).format('DD'), 10);
        this.currentMonth = parseInt(moment(date).format('MM'), 10) - 1;
        this.currentYear = Math.abs(parseInt(moment(date).format('YYYY'), 10));
        this.currentHours = parseInt(moment(date).format('HH'), 10);
        this.currentMinutes = parseInt(moment(date).format('mm'), 10);
        this.currentSeconds = parseInt(moment(date).format('ss'), 10);
        this.currentMilliseconds = parseInt(moment(date).format('SSS'), 10);

        this.selectedDay = this.currentDay;
        this.selectedDate = this.currentDate;
        this.selectedMonth = this.currentMonth;
        this.selectedYear = this.currentYear;
        this.selectedHours = this.currentHours;
        this.selectedMinutes = this.currentMinutes;
        this.selectedSeconds = this.currentSeconds;
        this.selectedMilliseconds = this.currentMilliseconds;
        // console.log(this.selectedDate, this.selectedDay, this.selectedMonth, this.selectedYear);
      }
    }

    this.showCalendar(
      Math.abs(parseInt(moment(date).format('YYYY'), 10)),
      parseInt(moment(date).format('MM'), 10) - 1,
      parseInt(moment(date).format('DD'), 10),
      parseInt(moment(date).format('HH'), 10),
      parseInt(moment(date).format('mm'), 10),
      parseInt(moment(date).format('ss'), 10),
      parseInt(moment(date).format('SSS'), 10)
    );
  }

  showCalendar(year?: number, month?: number, date?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number) {
    if (this.CW) {
      // console.log(year, month, date, hours, minutes, seconds, milliseconds);
      const firstDay = (new Date(year, month)).getDay();
      const daysInMonth = this.getDaysInMonth(month, year);
      // console.log(this.CW);

      const table = this.renderer.createElement('table');
      this.renderer.addClass(table, 'tbl-calendar');

      const r = this.renderer.createElement('tr');
      this.renderer.addClass(r, 'tr-calendar');
      for (let i = 0; i < 7; i++) {
        const cell = this.renderer.createElement('td');
        this.renderer.addClass(cell, 'td-calendar-days');
        const dateText = this.renderer.createText(this.days[(i + 6) % 7].slice(0, 2));
        this.renderer.appendChild(cell, dateText);
        this.renderer.appendChild(r, cell);
      }
      this.renderer.appendChild(table, r);

      let parseDate = 1;
      for (let i = 0; i < 6; i++) {
        // create a table row
        const row = this.renderer.createElement('tr');
        this.renderer.addClass(row, 'tr-calendar');
        // creating individual cells, filling them up with data.
        for (let j = 0; j < 7; j++) {
          const cell = this.renderer.createElement('td');
          this.renderer.addClass(cell, 'td-calendar');
          if (date === parseDate && this.selectedMonth === month && this.selectedYear === year) {
            this.renderer.addClass(cell, 'td-calendar-selected');
          }
          if (i === 0 && j < firstDay) {
            const emptyText = this.renderer.createText('');
            this.renderer.appendChild(cell, emptyText);
            this.renderer.removeClass(cell, 'td-calendar-selected');
            this.renderer.addClass(cell, 'td-calendar-empty');
          } else if (parseDate > daysInMonth) {
            break;
          } else {
            // const cell = this.renderer.createElement('td');
            const dateText = this.renderer.createText(parseDate + '');
            this.renderer.appendChild(cell, dateText);
            const that = this;
            this.renderer.listen(cell, 'click', () => that.selectDate(parseInt(dateText.data, 10)));
            parseDate++;
          }
          this.renderer.appendChild(row, cell);
        }
        this.renderer.appendChild(table, row);
      }
      // console.log(table);
      const existingTable = this.CW.nativeElement.getElementsByTagName('table');
      if (existingTable.length) {
        this.renderer.removeChild(this.CW.nativeElement, existingTable[0]);
      }
      this.renderer.appendChild(this.CW.nativeElement, table);

      // console.log(firstDay, daysInMonth);
    }
  }

  previous() {
    switch (this.view) {
      case 'calendar':
        this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
        this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
        this.showCalendar(this.currentYear, this.currentMonth, this.currentDate, this.currentHours, this.currentMinutes, this.currentSeconds, this.currentMilliseconds);
        break;
      case 'months':
        this.currentYear = this.currentYear - 1;
        break;
      case 'years':
        this.decadeStartYear -= 10;
        this.decadeEndYear -= 10;
        this.getYearsInDecade();
        break;
      default:
        this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
        this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
        this.showCalendar(this.currentYear, this.currentMonth, this.currentDate, this.currentHours, this.currentMinutes, this.currentSeconds, this.currentMilliseconds);
        break;
    }
  }

  next() {
    switch (this.view) {
      case 'calendar':
        this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
        this.currentMonth = (this.currentMonth + 1) % 12;
        this.showCalendar(this.currentYear, this.currentMonth, this.currentDate, this.currentHours, this.currentMinutes, this.currentSeconds, this.currentMilliseconds);
        break;
      case 'months':
        this.currentYear = this.currentYear + 1;
        break;
      case 'years':
        this.decadeStartYear += 10;
        this.decadeEndYear += 10;
        this.getYearsInDecade();
        break;
      default:
        this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
        this.currentMonth = (this.currentMonth + 1) % 12;
        this.showCalendar(this.currentYear, this.currentMonth, this.currentDate, this.currentHours, this.currentMinutes, this.currentSeconds, this.currentMilliseconds);
        break;
    }
  }

  jump(key: string) {
    const date = moment().format('DD-MMM-YYYY');
    switch (key) {
      case 'today':
        this.currentDay = parseInt(moment(date).format('d'), 10);
        this.currentDate = parseInt(moment(date).format('DD'), 10);
        this.currentMonth = parseInt(moment(date).format('MM'), 10) - 1;
        this.currentYear = Math.abs(parseInt(moment(date).format('YYYY'), 10));

        this.selectedDay = this.currentDay;
        this.selectedDate = this.currentDate;
        this.selectedMonth = this.currentMonth;
        this.selectedYear = this.currentYear;

        this.view = 'calendar';

        this.showCalendar(this.currentYear, this.currentMonth, this.currentDate, this.currentHours, this.currentMinutes, this.currentSeconds, this.currentMilliseconds);
        break;

      default:
        break;
    }
  }

  changeView(view: string) {
    this.view = view;
    if (view === 'years') {
      this.calculateDecadeYears();
    }
    if (view === 'calendar') {
      this.currentDay = ((new Date(this.currentYear, this.currentMonth, this.currentDate)).getDay() + 6) % 7;
      this.selectedDay = this.currentDay;
    }
  }

  calculateDecadeYears() {
    const start = new Date(this.round(this.currentYear, 10), 0, 1);
    const end = new Date(this.round(this.currentYear, 10) + 10, 0, 0);
    this.decadeStartYear = start.getFullYear();
    this.decadeEndYear = end.getFullYear();
    this.getYearsInDecade();
  }

  round(num: number, to: number) {
    return num - num % to;
  }

  selectDate(date: number) {
    // console.log(date);
    this.currentDate = date;
    this.selectedDate = date;
    this.selectedMonth = this.currentMonth;
    this.selectedYear = this.currentYear;
    this.selectedDay = (new Date(this.selectedYear, this.selectedMonth, this.selectedDate).getDay() + 6) % 7;
    this.showCalendar(this.currentYear, this.currentMonth, this.currentDate, this.currentHours, this.currentMinutes, this.currentSeconds, this.currentMilliseconds);
  }

  selectMonth(month: string) {
    this.currentMonth = this.months.indexOf(month);
    this.selectedMonth = this.months.indexOf(month);
    this.showCalendar(this.currentYear, this.currentMonth, this.currentDate, this.currentHours, this.currentMinutes, this.currentSeconds, this.currentMilliseconds);
    this.changeView('calendar');
  }

  selectYear(year: number) {
    this.currentYear = year;
    this.selectedYear = year;
    this.changeView('months');
  }

  getDaysInMonth(month: number, year: number): number {
    return 32 - new Date(year, month, 32).getDate();
  }

  getYearsInDecade() {
    this.YearsInDecade = [];
    for (let i = this.decadeStartYear; i <= this.decadeEndYear; i++) {
      this.YearsInDecade.push(i);
    }
  }

  appendZeroToSingleDigit(val: string): string {
    if (parseInt(val, 10) < 10) {
      return '0' + val;
    }
    return val;
  }

  isValidDate(value?: string): boolean {
    try {
      const m = moment(value);
      if (!m.isValid()) {
        console.log(m, m.invalidAt());
        if (m.invalidAt() >= 0) {
          console.error('Invalid ' + this.dateValidations[m.invalidAt()] + ' in ' + value + '.');
        } else {
          console.log('Invalid date.');
        }
        return false;
      }
      return true;
    } catch (ex) {
      console.error(ex);
      return false;
    }
  }
}
