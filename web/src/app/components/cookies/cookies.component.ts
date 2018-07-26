import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit {

  constructor(private storeService: StoreService) { }

  ngOnInit() {
    this.storeService.dispatch(Actions.UI.UpdateShowHomeIcon, true);
  }

}
