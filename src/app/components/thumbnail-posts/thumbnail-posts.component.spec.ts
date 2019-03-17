import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailPostsComponent } from './thumbnail-posts.component';

describe('ThumbnailPostsComponent', () => {
  let component: ThumbnailPostsComponent;
  let fixture: ComponentFixture<ThumbnailPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThumbnailPostsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
