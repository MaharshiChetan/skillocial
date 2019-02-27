import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventsPage } from './user-events.page';

describe('UserEventsPage', () => {
  let component: UserEventsPage;
  let fixture: ComponentFixture<UserEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEventsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
