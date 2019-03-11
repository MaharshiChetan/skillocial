import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePostPage } from './single-post.page';

describe('SinglePostPage', () => {
  let component: SinglePostPage;
  let fixture: ComponentFixture<SinglePostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglePostPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglePostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
