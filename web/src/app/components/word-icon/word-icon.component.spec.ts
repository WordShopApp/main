import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordIconComponent } from './word-icon.component';

describe('WordIconComponent', () => {
  let component: WordIconComponent;
  let fixture: ComponentFixture<WordIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
