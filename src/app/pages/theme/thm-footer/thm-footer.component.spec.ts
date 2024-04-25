import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThmFooterComponent } from './thm-footer.component';

describe('ThmFooterComponent', () => {
  let component: ThmFooterComponent;
  let fixture: ComponentFixture<ThmFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThmFooterComponent]
    });
    fixture = TestBed.createComponent(ThmFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
