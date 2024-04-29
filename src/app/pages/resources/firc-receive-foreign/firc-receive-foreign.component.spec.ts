import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FircReceiveForeignComponent } from './firc-receive-foreign.component';

describe('FircReceiveForeignComponent', () => {
  let component: FircReceiveForeignComponent;
  let fixture: ComponentFixture<FircReceiveForeignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FircReceiveForeignComponent]
    });
    fixture = TestBed.createComponent(FircReceiveForeignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
