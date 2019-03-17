import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlesListPage } from './battles-list.page';

describe('BattlesListPage', () => {
  let component: BattlesListPage;
  let fixture: ComponentFixture<BattlesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattlesListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattlesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
