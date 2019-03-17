import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCalculationComponent } from './payment-calculation.component';

describe('PaymentCalculationComponent', () => {
  let component: PaymentCalculationComponent;
  let fixture: ComponentFixture<PaymentCalculationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentCalculationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
