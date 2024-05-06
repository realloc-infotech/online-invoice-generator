import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasteringInvoiceComponent } from './mastering-invoice.component';

describe('MasteringInvoiceComponent', () => {
  let component: MasteringInvoiceComponent;
  let fixture: ComponentFixture<MasteringInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasteringInvoiceComponent]
    });
    fixture = TestBed.createComponent(MasteringInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
