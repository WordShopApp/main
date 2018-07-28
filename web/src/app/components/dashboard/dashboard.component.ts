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

  constructor (private rosieService: RosieService, private storeService: StoreService) { }

  ngOnInit () {
    this.rosieService.cleanup();
    this.setupSubscriptions();
  }

  ngOnDestroy () {
    this.teardownSubscriptions();
  }

  private setupSubscriptions () {
    this.profile$ = this.storeService.subscribe(Props.App.Profile, p => this.profile = p && p.toJS());
  }

  private teardownSubscriptions () {
    this.profile$.unsubscribe();
  }

}
