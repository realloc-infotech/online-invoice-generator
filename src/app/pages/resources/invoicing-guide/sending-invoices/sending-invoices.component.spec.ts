import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendingInvoicesComponent } from './sending-invoices.component';

describe('SendingInvoicesComponent', () => {
  let component: SendingInvoicesComponent;
  let fixture: ComponentFixture<SendingInvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendingInvoicesComponent]
    });
    fixture = TestBed.createComponent(SendingInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
