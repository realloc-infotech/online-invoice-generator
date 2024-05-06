import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamliningInvoiceComponent } from './streamlining-invoice.component';

describe('StreamliningInvoiceComponent', () => {
  let component: StreamliningInvoiceComponent;
  let fixture: ComponentFixture<StreamliningInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StreamliningInvoiceComponent]
    });
    fixture = TestBed.createComponent(StreamliningInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
