import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleZonePage } from './battle-zone.page';

describe('BattleZonePage', () => {
  let component: BattleZonePage;
  let fixture: ComponentFixture<BattleZonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleZonePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleZonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
