import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderstandingInvoiceComponent } from './understanding-invoice.component';

describe('UnderstandingInvoiceComponent', () => {
  let component: UnderstandingInvoiceComponent;
  let fixture: ComponentFixture<UnderstandingInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnderstandingInvoiceComponent]
    });
    fixture = TestBed.createComponent(UnderstandingInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
