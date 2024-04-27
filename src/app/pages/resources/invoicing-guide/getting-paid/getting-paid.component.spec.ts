import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingPaidComponent } from './getting-paid.component';

describe('GettingPaidComponent', () => {
  let component: GettingPaidComponent;
  let fixture: ComponentFixture<GettingPaidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GettingPaidComponent]
    });
    fixture = TestBed.createComponent(GettingPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
