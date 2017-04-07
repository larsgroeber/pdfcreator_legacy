import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSelectComponent } from './template-select.component';

describe('TemplateSelectComponent', () => {
  let component: TemplateSelectComponent;
  let fixture: ComponentFixture<TemplateSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
