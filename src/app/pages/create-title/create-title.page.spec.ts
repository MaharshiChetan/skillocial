import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTitlePage } from './create-title.page';

describe('CreateTitlePage', () => {
  let component: CreateTitlePage;
  let fixture: ComponentFixture<CreateTitlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTitlePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTitlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
