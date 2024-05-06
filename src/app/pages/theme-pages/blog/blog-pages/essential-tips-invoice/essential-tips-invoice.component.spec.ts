import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssentialTipsInvoiceComponent } from './essential-tips-invoice.component';

describe('EssentialTipsInvoiceComponent', () => {
  let component: EssentialTipsInvoiceComponent;
  let fixture: ComponentFixture<EssentialTipsInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EssentialTipsInvoiceComponent]
    });
    fixture = TestBed.createComponent(EssentialTipsInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
