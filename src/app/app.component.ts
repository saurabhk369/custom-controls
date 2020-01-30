import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import * as mtz from 'moment-timezone';

@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'custom-controls';

  @ViewChild('CalendarWrapper', { static: true }) CW: ElementRef<HTMLDivElement>;

  view = 'time';

  dateValidations = ['year', 'month', 'day', 'hours', 'minutes', 'seconds', 'milliseconds'];
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  timezones: any[] = [];

  currentDay: number;
  currentDate: number;
  currentMonth: number;
  currentYear: number;
  currentHours: number;
  currentMinutes: number;
  currentSeconds: number;
  currentMilliseconds: number;
  currentMeridiem: string;
  currentTimeZone: string;

  selectedDay: number;
  selectedDate: number;
  selectedMonth: number;
  selectedYear: number;
  selectedHours: number;
  selectedMinutes: number;
  selectedSeconds: number;
  selectedMilliseconds: number;
  selectedMeridiem: string;
  selectedTimeZone: string;

  hourFormat24 = true;

  decadeStartYear: number;
  decadeEndYear: number;
  YearsInDecade = [];
  hours = Array.from({ length: 24 }, (v, k) => k++);
  minutesSeconds = Array.from({ length: 59 }, (v, k) => k++);

  // defaultDate = '16-Jan-1994 01:05 AM';
  defaultDate;

  constructor(private renderer: Renderer2, private elem: ElementRef) { }

  ngOnInit() {
    console.log(this.hours, this.minutesSeconds);
    this.defaultDate = this.defaultDate || new Date();
    const date = moment(this.defaultDate).format('DD-MMMYYYY HH:mm:ss Z');

    if (date) {
      if (this.isValidDate(date)) {
        mtz.tz.names().map((t: string) => {
          this.timezones.push({
            offset: mtz(date).tz(t).format('Z'),
            offsetMinutes: this.convertTimeOffsetHoursToMinutes(mtz(date).tz(t).format('Z')),
            name: mtz(date).tz(t).format('zz'),
            location: t
          });
        });
        this.timezones.sort(this.compareValues('offsetMinutes', 'desc'));

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
        this.currentMeridiem = moment(date).format('A');
        this.currentTimeZone = this.convertTimeOffsetHoursToMinutes(moment(date).utcOffset() + '');

        this.selectedDay = this.currentDay;
        this.selectedDate = this.currentDate;
        this.selectedMonth = this.currentMonth;
        this.selectedYear = this.currentYear;
        this.selectedHours = this.currentHours;
        this.selectedMinutes = this.currentMinutes;
        this.selectedSeconds = this.currentSeconds;
        this.selectedMilliseconds = this.currentMilliseconds;
        this.selectedMeridiem = this.currentMeridiem;
        this.selectedTimeZone = this.currentTimeZone;
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
    const time = moment().format('YYYY-MM-DDTHH:mm:ss');
    console.log(date, time);
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
      case 'now':
        if (this.hourFormat24) {
          this.currentHours = moment(time).get('hours');
        } else {
          this.currentHours = parseInt(moment(time).format('h'), 10);
        }
        this.currentMinutes = moment(time).get('minutes');
        this.currentSeconds = moment(time).get('seconds');
        this.currentMeridiem = moment(time).format('A');

        console.log(this.currentHours, this.currentMinutes, this.currentSeconds, moment(time).format('A'));

        this.selectedHours = this.currentHours;
        this.selectedMinutes = this.currentMinutes;
        this.selectedSeconds = this.currentSeconds;
        this.selectedMeridiem = this.currentMeridiem;

        this.view = 'time';
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

  changeHourFormat(format: boolean) {
    this.hourFormat24 = format;
    const time = this.selectedDate + '-' + this.months[this.selectedMonth] + '-' + this.selectedYear + ' ' + this.selectedHours + ':' + this.selectedMinutes + ':' + this.selectedSeconds;

    this.currentMinutes = moment(time).get('minutes');
    this.currentSeconds = moment(time).get('seconds');
    // this.currentMeridiem = moment(time).format('A');
    console.log(this.currentMeridiem);
    if (this.hourFormat24) {
      // this.hours = Array.from({ length: 24 }, (v, k) => k++);
      if (this.currentMeridiem === 'AM') {
        this.currentHours = moment(time).get('hours');
      } else {
        this.currentHours = moment(time).get('hours') < 12 ? moment(time).get('hours') + 12 : moment(time).get('hours');
      }
    } else {
      // this.hours = Array.from({ length: 12 }, (v, k) => k++);
      this.currentHours = parseInt(moment(time).format('h'), 10);
    }

    // this.selectedHours = this.currentHours;
    // this.selectedMinutes = this.currentMinutes;
    // this.selectedSeconds = this.currentSeconds;
    this.selectedMeridiem = this.currentMeridiem;

    this.view = 'time';
  }

  changeTimeOnView() {
    console.log(this.currentHours, this.currentMinutes, this.currentSeconds);
    this.changeTime(this.currentHours, 'h');
    this.changeTime(this.currentMinutes, 'm');
    this.changeTime(this.currentSeconds, 's');
  }

  checkHourBlockVisiblity(hour: number): string {
    if (!this.hourFormat24 && hour > 12) {
      return 'none';
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

  convertTimeOffsetHoursToMinutes(offset: string): string {
    if (!(offset.startsWith('+') || offset.startsWith('-'))) {
      offset = '+' + offset;
    }
    const offsetSide = offset.slice(0, 1);
    const time = offset.slice(1, offset.length);
    let timeParts = [];
    if (time.includes(':')) {
      timeParts = time.split(':');
      offset = (parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10)) + '';
    } else {
      timeParts.push(this.round(parseInt(time, 10), 100) + ''); timeParts.push(time.slice(time.length - 2, time.length));
      offset = (parseInt(timeParts[0], 10) + parseInt(timeParts[1], 10)) + '';
    }
    switch (offset.length) {
      case 1:
        offset = '000' + offset;
        break;
      case 2:
        offset = '00' + offset;
        break;
      case 3:
        offset = '0' + offset;
        break;
    }
    offset = offsetSide + offset;
    return offset;
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

  compareValues(key: string, order = 'asc') {
    return function innerSort(a: any, b: any) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property does not exist on either object
        return 0;
      }

      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  changeTime(value: number, unitOfTIme: string) {
    switch (unitOfTIme) {
      case 'h':
        if (value < this.selectedHours) {
          while (this.selectedHours !== value) {
            console.log(this.selectedHours, value);
            this.rollTop('hours-rotator');
          }
        } else {
          while (this.selectedHours !== value) {
            console.log(this.selectedHours, value);
            this.rollBottom('hours-rotator');
          }
        }
        break;
      case 'm':
        if (value < this.selectedMinutes) {
          while (this.selectedMinutes !== value) {
            console.log(this.selectedMinutes, value);
            this.rollTop('minutes-rotator');
          }
        } else {
          while (this.selectedMinutes !== value) {
            console.log(this.selectedMinutes, value);
            this.rollBottom('minutes-rotator');
          }
        }
        break;
      case 's':
        if (value < this.selectedSeconds) {
          while (this.selectedSeconds !== value) {
            console.log(this.selectedSeconds, value);
            this.rollTop('seconds-rotator');
          }
        } else {
          while (this.selectedSeconds !== value) {
            console.log(this.selectedSeconds, value);
            this.rollBottom('seconds-rotator');
          }
        }
        break;
    }
  }

  changeMeridiem(meridiem: string) {
    this.currentMeridiem = meridiem;
    this.selectedMeridiem = meridiem;
  }

  rollTop(id: string) {
    const el = this.elem.nativeElement.querySelector('#' + id) as HTMLDivElement;
    el.insertBefore(el.lastChild, el.firstChild);
    let nodeValue = (el.childNodes[1] as HTMLDivElement).innerText;
    // console.log(nodeValue);
    if (!nodeValue) {
      nodeValue = '00';
    }
    switch (id) {
      case 'hours-rotator':
        this.currentHours = parseInt(nodeValue, 10);
        this.selectedHours = this.currentHours;
        break;
      case 'minutes-rotator':
        this.currentMinutes = parseInt(nodeValue, 10);
        this.selectedMinutes = this.currentMinutes;
        break;
      case 'seconds-rotator':
        this.currentSeconds = parseInt(nodeValue, 10);
        this.selectedSeconds = this.currentSeconds;
        break;
    }
    if ((el.childNodes[1] as HTMLDivElement).innerText === '00') {
      this.rollTop(id);
    }
    // if (!this.hourFormat24 && parseInt(nodeValue, 10) > 11) {
    //   while (nodeValue === '00') {
    //     this.rollTop(id);
    //   }
    // }
  }

  rollBottom(id: string) {
    const el = this.elem.nativeElement.querySelector('#' + id) as HTMLDivElement;
    el.appendChild(el.firstChild);
    let nodeValue = (el.childNodes[1] as HTMLDivElement).innerText;
    // console.log(nodeValue);
    if (!nodeValue) {
      nodeValue = '00';
    }
    switch (id) {
      case 'hours-rotator':
        this.currentHours = parseInt(nodeValue, 10);
        this.selectedHours = this.currentHours;
        break;
      case 'minutes-rotator':
        this.currentMinutes = parseInt(nodeValue, 10);
        this.selectedMinutes = this.currentMinutes;
        break;
      case 'seconds-rotator':
        this.currentSeconds = parseInt(nodeValue, 10);
        this.selectedSeconds = this.currentSeconds;
        break;
    }

    if ((el.childNodes[1] as HTMLDivElement).innerText === '00') {
      this.rollBottom(id);
    }
    // if (!this.hourFormat24 && parseInt(nodeValue, 10) > 11) {
    //   while (nodeValue === '00') {
    //     this.rollBottom(id);
    //   }
    // }
  }

  timeScroll(evt: WheelEvent, containerId: string) {
    if (evt.deltaY < 0) {
      this.rollTop(containerId);
    } else {
      this.rollBottom(containerId);
    }
  }
}
