import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PDFInputComponent } from './pdfinput.component';

describe('PDFInputComponent', () => {
  let component: PDFInputComponent;
  let fixture: ComponentFixture<PDFInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PDFInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PDFInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
