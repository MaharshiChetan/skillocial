import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackEventPage } from './track-event.page';

describe('TrackEventPage', () => {
  let component: TrackEventPage;
  let fixture: ComponentFixture<TrackEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackEventPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
