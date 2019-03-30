import { TestBed } from '@angular/core/testing';

import { UsersParticipationInEventService } from './users-participation-in-event.service';

describe('UsersParticipationInEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsersParticipationInEventService = TestBed.get(UsersParticipationInEventService);
    expect(service).toBeTruthy();
  });
});
