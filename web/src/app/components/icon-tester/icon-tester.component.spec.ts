import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTesterComponent } from './icon-tester.component';

describe('IconTesterComponent', () => {
  let component: IconTesterComponent;
  let fixture: ComponentFixture<IconTesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconTesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
