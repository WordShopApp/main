import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';
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
    this.profile$ = this.storeService.subscribe(Actions.Init.Profile, p => this.profile = p);
  }

  private teardownSubscriptions () {
    this.profile$.unsubscribe();
  }

}
