import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigatingGstInvoiceComponent } from './navigating-gst-invoice.component';

describe('NavigatingGstInvoiceComponent', () => {
  let component: NavigatingGstInvoiceComponent;
  let fixture: ComponentFixture<NavigatingGstInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavigatingGstInvoiceComponent]
    });
    fixture = TestBed.createComponent(NavigatingGstInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
