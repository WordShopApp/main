import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { AccountService } from '../../services/account/account.service';
import { AuthService } from '../../services/auth/auth.service';
import { LoggerService } from '../../services/logger/logger.service';
import { NavService } from '../../services/nav/nav.service';
import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';

@Injectable()
export class RootResolver implements Resolve<any> {

  constructor (
    private accountService: AccountService,
    private authService: AuthService,
    private loggerService: LoggerService,
    private navService: NavService,
    private storeService: StoreService
  ) {}

  resolve () {
    return new Promise((resolve, reject) => {
      this.storeService.dispatch(Actions.UI.UpdateShowHomeIcon, true);
      let p = this.accountService.getOrCreateProfile().then(profile => {
        return this.storeService.dispatch(Actions.Init.Profile, profile);
      });
      Promise.all([p]).then(() => {
        this.loggerService.info('RootResolver.resolve');
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
