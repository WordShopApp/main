import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBannerComponent } from './project-banner.component';

describe('ProjectBannerComponent', () => {
  let component: ProjectBannerComponent;
  let fixture: ComponentFixture<ProjectBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
