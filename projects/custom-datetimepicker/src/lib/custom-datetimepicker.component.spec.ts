import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDatetimepickerComponent } from './custom-datetimepicker.component';

describe('CustomDatetimepickerComponent', () => {
  let component: CustomDatetimepickerComponent;
  let fixture: ComponentFixture<CustomDatetimepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDatetimepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDatetimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
