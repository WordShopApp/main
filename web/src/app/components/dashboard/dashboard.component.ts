import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoggerService } from '../../services/logger/logger.service';
import { StoreService } from '../../services/store/store.service';
import { StoreProps as Props } from '../../services/store/store.props';
import { RosieService } from '../../services/rosie/rosie.service';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  profile: any;
  profile$: Subscription;

  projects: any;
  project$: Subscription;
  projectsLoading = false;

  critiques: any;
  critique$: Subscription;

  activeTab: string;
  activeTabKey = 'dashboardActiveTab';

  constructor (
    private loggerService: LoggerService,
    private projectService: ProjectService,
    private rosieService: RosieService,
    private storeService: StoreService
  ) { }

  ngOnInit () {
    this.initActiveTab();
    this.setupSubscriptions();
    this.rosieService.cleanup();
  }

  ngOnDestroy () {
    this.teardownSubscriptions();
  }

  initActiveTab () {
    this.setActiveTab(this.storeService.local.get(this.activeTabKey) || 'projects');
  }

  setActiveTab (tabName: string) {
    this.activeTab = tabName;
    this.storeService.local.set(this.activeTabKey, tabName);
  }

  private setupSubscriptions () {
    this.profile$ = this.storeService.subscribe(Props.App.Profile, p => this.profile = p && p.toJS());
    this.project$ = this.storeService.subscribe(Props.App.Projects, p => this.projects = p && p.toJS());
    this.critique$ = this.storeService.subscribe(Props.App.Critiques, c => this.critiques = c && c.toJS());
  }

  private teardownSubscriptions () {
    this.profile$.unsubscribe();
    this.project$.unsubscribe();
    this.critique$.unsubscribe();
  }

}
