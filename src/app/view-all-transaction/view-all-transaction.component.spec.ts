import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllTransactionComponent } from './view-all-transaction.component';

describe('ViewAllTransactionComponent', () => {
  let component: ViewAllTransactionComponent;
  let fixture: ComponentFixture<ViewAllTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
