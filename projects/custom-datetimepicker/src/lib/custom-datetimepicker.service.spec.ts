import { TestBed } from '@angular/core/testing';

import { CustomDatetimepickerService } from './custom-datetimepicker.service';

describe('CustomDatetimepickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomDatetimepickerService = TestBed.get(CustomDatetimepickerService);
    expect(service).toBeTruthy();
  });
});
