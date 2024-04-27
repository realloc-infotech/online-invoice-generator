import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingInvoicesComponent } from './creating-invoices.component';

describe('CreatingInvoicesComponent', () => {
  let component: CreatingInvoicesComponent;
  let fixture: ComponentFixture<CreatingInvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatingInvoicesComponent]
    });
    fixture = TestBed.createComponent(CreatingInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
