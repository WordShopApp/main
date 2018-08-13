import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropTesterComponent } from './crop-tester.component';

describe('CropTesterComponent', () => {
  let component: CropTesterComponent;
  let fixture: ComponentFixture<CropTesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropTesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
