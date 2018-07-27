import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {

  darkMode: boolean;
  dmel: any;

  constructor (private storeService: StoreService) { }

  ngOnInit() {
    this.darkMode = this.storeService.local.get('darkMode') === 'true';
    this.storeService.dispatch(Actions.UI.UpdateShowHomeIcon, false);
    let dmcb = document.getElementById('switch-sm');
    if (dmcb) this.dmel = dmcb.addEventListener('change', this.updateDarkMode.bind(this));
  }

  ngOnDestroy() {
    this.storeService.dispatch(Actions.UI.UpdateShowHomeIcon, true);
    let dmcb = document.getElementById('switch-sm');
    if (dmcb) this.dmel = dmcb.removeEventListener('change', this.updateDarkMode.bind(this));
  }

  updateDarkMode (evt) {
    this.darkMode = evt.target.checked;
  }

}
