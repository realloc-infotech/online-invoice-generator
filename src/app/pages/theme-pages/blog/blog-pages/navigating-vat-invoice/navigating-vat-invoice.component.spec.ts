import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigatingVatInvoiceComponent } from './navigating-vat-invoice.component';

describe('NavigatingVatInvoiceComponent', () => {
  let component: NavigatingVatInvoiceComponent;
  let fixture: ComponentFixture<NavigatingVatInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigatingVatInvoiceComponent]
    });
    fixture = TestBed.createComponent(NavigatingVatInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
