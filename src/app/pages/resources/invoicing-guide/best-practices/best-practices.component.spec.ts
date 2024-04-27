import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestPracticesComponent } from './best-practices.component';

describe('BestPracticesComponent', () => {
  let component: BestPracticesComponent;
  let fixture: ComponentFixture<BestPracticesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BestPracticesComponent]
    });
    fixture = TestBed.createComponent(BestPracticesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
