import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PDFDisplayComponent } from './pdf-display.component';

describe('PDFInputComponent', () => {
  let component: PDFDisplayComponent;
  let fixture: ComponentFixture<PDFDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PDFDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PDFDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
