import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { GravatarService } from '../gravatar/gravatar.service';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';
import { StoreService } from '../store/store.service';

@Injectable()
export class AccountService extends ApiService {

  constructor (
    authService: AuthService,
    http: HttpClient,
    settingsService: SettingsService,
    private gravatarService: GravatarService,
    private loggerService: LoggerService,
    private storeService: StoreService
  ) { 
    super(authService, http, settingsService);
  }

  toBool (str): boolean {
    return str === 'true';
  }

  getOrCreateProfile (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getProfile().then(resolve).catch(err => {
        this.token().then(t => {
          if (t) {
            let email = this.storeService.local.get('email');
            let subscription = this.storeService.local.get('subscription');
            let joinMailingList = this.storeService.local.get('join_mailing_list');
            let avatar = this.gravatarService.url(email);
            this.createProfile({ 
              email, 
              subscription,
              avatar,
              join_mailing_list: this.toBool(joinMailingList)
            }).then(resolve).catch(reject);
          } else {
            reject('Auth Token Not Found');
          }
        }).catch(reject);
      });
    });
  }

  createProfile (userData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loggerService.info('AccountService', 'Create Profile', userData);
      this.post(this.profileUrl(), userData).then(profile => {
        this.loggerService.info('AccountService', 'Create Profile Success', profile);
        resolve(profile);
      }).catch(reject);
    });
  }

  getProfile (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loggerService.info('AccountService', 'Get Profile');
      this.get(this.profileUrl()).then(profile => {
        this.loggerService.info('AccountService', 'Get Profile Success', profile);
        resolve(profile);
      }).catch(reject);
    });
  }

  private profileUrl (): string {
    return this.url(this._settingsService.app('profilePath'));
  }

}
