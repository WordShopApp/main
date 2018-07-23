import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';
import { StoreService } from '../store/store.service';
import { StoreActions as Actions } from '../store/store.actions';

@Injectable()
export class AccountService extends ApiService {

  constructor (private authService: AuthService, private loggerService: LoggerService, _http: HttpClient, _settingsService: SettingsService, private storeService: StoreService) { 
    super(_http, _settingsService);
  }

  init () {
    this.authService.init();
  }

  login () {

  }

  details () {
    return this.authService.details();
  }

  logout () {
    this.storeService.dispatch(Actions.Init.Profile, null);
  }

  apiBody (data, auth) {
    return {
      data: data,
      auth: auth
    };
  }

  createProfile (userData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loggerService.info('AccountService', 'Create Account', userData);
        let awsCreds = null;
        let url = this.accountCreateUrl();
        let body = this.apiBody(userData, awsCreds);
        let opts = { headers: this.jsonHeaders() };
        this.post(url, body, opts).then(res => {
          let profile = res.json();
          this.loggerService.info('AccountService', 'Create Account Success', profile);
          resolve(profile);
        }).catch(reject);
    });
  }

  getProfile (authData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loggerService.info('AccountService', 'Get Profile', authData);
      let url = this.profileUrl();
      let body = this.apiBody({ identityId: authData.identityId }, authData);
      let opts = { headers: this.jsonHeaders() };
      this.post(url, body, opts).then(res => {
        let profile = res.json();
        this.loggerService.info('AccountService', 'Get Profile Success', profile);
        resolve(profile);
      }).catch(reject);
    });
  }

  private accountCreateUrl (): string {
    return this.url(this._settingsService.app('accountCreate'));
  }

  private profileUrl (): string {
    return this.url(this._settingsService.app('profile'));
  }

}
