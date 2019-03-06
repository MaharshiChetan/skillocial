import { TestBed } from '@angular/core/testing';

import { ActiveUsersInEventService } from './active-users-in-event.service';

describe('ActiveUsersInEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveUsersInEventService = TestBed.get(ActiveUsersInEventService);
    expect(service).toBeTruthy();
  });
});
