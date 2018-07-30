import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { StoreService } from '../../services/store/store.service';
import { StoreProps as Props } from '../../services/store/store.props';
import { RosieService } from '../../services/rosie/rosie.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  profile: any;
  profile$: Subscription;

  activeTab: string;
  activeTabKey = 'dashboardActiveTab';

  constructor (private rosieService: RosieService, private storeService: StoreService) { }

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
  }

  private teardownSubscriptions () {
    this.profile$.unsubscribe();
  }

}
