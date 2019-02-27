import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitlesListPage } from './titles-list.page';

describe('TitlesListPage', () => {
  let component: TitlesListPage;
  let fixture: ComponentFixture<TitlesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitlesListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitlesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
