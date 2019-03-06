import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRequestsPage } from './my-requests.page';

describe('MyRequestsPage', () => {
  let component: MyRequestsPage;
  let fixture: ComponentFixture<MyRequestsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRequestsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
