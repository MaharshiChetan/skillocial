import { TestBed } from '@angular/core/testing';

import { EventPaymentService } from './event-payment.service';

describe('EventPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventPaymentService = TestBed.get(EventPaymentService);
    expect(service).toBeTruthy();
  });
});
