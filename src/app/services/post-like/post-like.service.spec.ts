import { TestBed } from '@angular/core/testing';

import { PostLikeService } from './post-like.service';

describe('PostLikeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostLikeService = TestBed.get(PostLikeService);
    expect(service).toBeTruthy();
  });
});
