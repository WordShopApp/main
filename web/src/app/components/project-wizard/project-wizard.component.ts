import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AccountService } from '../../services/account/account.service';
import { NavService } from '../../services/nav/nav.service';
import { StoreService } from '../../services/store/store.service';
import { StoreProps as Props } from '../../services/store/store.props';

@Component({
  selector: 'app-project-wizard',
  templateUrl: './project-wizard.component.html',
  styleUrls: ['./project-wizard.component.scss']
})
export class ProjectWizardComponent implements OnInit, OnDestroy {

  project: any;
  step: number;

  profile: any;
  profile$: Subscription;

  newProjectTemplate = [
    {
      name: 'Title',
      complete: null,
      title: null,
      multipart: false,
      part_name: null
    },
    {
      name: 'Text',
      complete: null,
      text: null,
      context: null
    },
    {
      name: 'Categories',
      complete: null,
      categories: []
    },
    {
      name: 'Critique',
      complete: null,
      questions: []
    },
    {
      name: 'Review',
      complete: null,
      private: null
    }
  ];

  constructor (
    private accountService: AccountService,
    private navService: NavService,
    private storeService: StoreService
  ) { }

  ngOnInit () {
    this.setupSubscriptions();
  }

  ngOnDestroy () {
    this.teardownSubscriptions();
  }

  private setupProject () {
    this.project = this.profile.project_in_progress || this.newProjectTemplate;
    this.setCurrStep(this.getCurrStep(this.project));
  }

  private getCurrStep (project): number {
    let step = -1;
    for (let p = 0; p < project.length; p += 1) {
      if (!project[p].complete) {
        step = p;
        break;
      }
    }
    return step;
  }

  private setCurrStep (step) {
    if (step !== null) {
      this.step = step;
      this.project[step].complete = false;
    }
  }

  private createProject () {
    this.navService.gotoRoot();
  }

  private setupSubscriptions () {
    this.profile$ = this.storeService.subscribe(Props.App.Profile, p => {
      this.profile = p && p.toJS();
      if (!this.project) this.setupProject();
    });
  }

  private teardownSubscriptions () {
    this.profile$.unsubscribe();
  }



}
