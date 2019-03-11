import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailPostsPage } from './thumbnail-posts.page';

describe('ThumbnailPostsPage', () => {
  let component: ThumbnailPostsPage;
  let fixture: ComponentFixture<ThumbnailPostsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbnailPostsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailPostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
