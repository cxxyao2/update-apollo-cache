import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordWithoutRefComponent } from './record-without-ref.component';

describe('RecordWithoutRefComponent', () => {
  let component: RecordWithoutRefComponent;
  let fixture: ComponentFixture<RecordWithoutRefComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordWithoutRefComponent]
    });
    fixture = TestBed.createComponent(RecordWithoutRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
