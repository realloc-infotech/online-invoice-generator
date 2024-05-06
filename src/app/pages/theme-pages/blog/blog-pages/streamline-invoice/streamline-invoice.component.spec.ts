import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamlineInvoiceComponent } from './streamline-invoice.component';

describe('StreamlineInvoiceComponent', () => {
  let component: StreamlineInvoiceComponent;
  let fixture: ComponentFixture<StreamlineInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StreamlineInvoiceComponent]
    });
    fixture = TestBed.createComponent(StreamlineInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
