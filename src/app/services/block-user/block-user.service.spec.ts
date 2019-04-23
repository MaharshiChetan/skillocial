import { TestBed } from '@angular/core/testing';

import { BlockUserService } from './block-user.service';

describe('BlockUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlockUserService = TestBed.get(BlockUserService);
    expect(service).toBeTruthy();
  });
});
