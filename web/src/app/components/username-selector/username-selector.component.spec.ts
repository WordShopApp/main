import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameSelectorComponent } from './username-selector.component';

describe('UsernameSelectorComponent', () => {
  let component: UsernameSelectorComponent;
  let fixture: ComponentFixture<UsernameSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsernameSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
