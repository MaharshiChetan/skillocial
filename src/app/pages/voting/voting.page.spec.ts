import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingPage } from './voting.page';

describe('VotingPage', () => {
  let component: VotingPage;
  let fixture: ComponentFixture<VotingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
