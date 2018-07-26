import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {

  constructor (private storeService: StoreService) { }

  ngOnInit() {
    this.storeService.dispatch(Actions.UI.UpdateShowHomeIcon, false);
  }

  ngOnDestroy() {
    this.storeService.dispatch(Actions.UI.UpdateShowHomeIcon, true);
  }

}
