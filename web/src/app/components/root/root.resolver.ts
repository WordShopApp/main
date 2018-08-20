import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { AccountService } from '../../services/account/account.service';
import { AuthService } from '../../services/auth/auth.service';
import { LoggerService } from '../../services/logger/logger.service';
import { NavService } from '../../services/nav/nav.service';
import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';
import { StoreProps as Props } from '../../services/store/store.props';
import { ViewService } from '../../services/view/view.service';

@Injectable()
export class RootResolver implements Resolve<any> {

  constructor (
    private accountService: AccountService,
    private authService: AuthService,
    private loggerService: LoggerService,
    private navService: NavService,
    private storeService: StoreService,
    private viewService: ViewService
  ) {}

  resolve () {
    return new Promise((resolve, reject) => {

      let prof = this.storeService.get(Props.App.Profile);
      let proj = this.storeService.get(Props.App.Projects);
      let crit = this.storeService.get(Props.App.Critiques);
      if (prof && proj && crit) return resolve();
      
      let pp = this.accountService.getOrCreateProfile();
      let ip = this.viewService.init();
      Promise.all([pp, ip]).then(res => {
        let profile = res[0];
        let projects = res[1].projects;
        let critiques = res[1].critiques;
        this.storeService.dispatch(Actions.Init.Profile, profile);
        this.storeService.dispatch(Actions.Init.Projects, projects);
        this.storeService.dispatch(Actions.Init.Critiques, critiques);
        this.storeService.dispatch(Actions.UI.UpdateShowHomeIcon, true);
        this.storeService.dispatch(Actions.Init.LoggedIn, true);
        resolve();
      }).catch(err => {
        this.authService.logout();
        this.navService.gotoLogin();
        this.loggerService.error(err);
        reject(err);
      });
      
    });
  }
}
