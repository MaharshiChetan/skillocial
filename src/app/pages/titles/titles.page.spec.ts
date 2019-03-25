import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitlesPage } from './titles.page';

describe('TitlesPage', () => {
  let component: TitlesPage;
  let fixture: ComponentFixture<TitlesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitlesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitlesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
