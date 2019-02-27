import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChatsPage } from './user-chats.page';

describe('UserChatsPage', () => {
  let component: UserChatsPage;
  let fixture: ComponentFixture<UserChatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserChatsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
