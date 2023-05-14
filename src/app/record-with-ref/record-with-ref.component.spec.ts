import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordWithRefComponent } from './record-with-ref.component';

describe('RecordWithRefComponent', () => {
  let component: RecordWithRefComponent;
  let fixture: ComponentFixture<RecordWithRefComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordWithRefComponent]
    });
    fixture = TestBed.createComponent(RecordWithRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
