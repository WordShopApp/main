import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CritiqueEditorComponent } from './critique-editor.component';

describe('CritiqueEditorComponent', () => {
  let component: CritiqueEditorComponent;
  let fixture: ComponentFixture<CritiqueEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CritiqueEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CritiqueEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
