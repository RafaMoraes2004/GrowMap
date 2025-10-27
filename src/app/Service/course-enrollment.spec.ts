import { TestBed } from '@angular/core/testing';

import { CourseEnrollment } from './course-enrollment';

describe('CourseEnrollment', () => {
  let service: CourseEnrollment;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseEnrollment);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
