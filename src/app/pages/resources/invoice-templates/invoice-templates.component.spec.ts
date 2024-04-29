import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTemplatesComponent } from './invoice-templates.component';

describe('InvoiceTemplatesComponent', () => {
  let component: InvoiceTemplatesComponent;
  let fixture: ComponentFixture<InvoiceTemplatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceTemplatesComponent]
    });
    fixture = TestBed.createComponent(InvoiceTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
