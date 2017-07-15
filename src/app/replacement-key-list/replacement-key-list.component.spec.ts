import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementKeyListComponent } from './replacement-key-list.component';

describe('ReplacementKeyListComponent', () => {
  let component: ReplacementKeyListComponent;
  let fixture: ComponentFixture<ReplacementKeyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplacementKeyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacementKeyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
