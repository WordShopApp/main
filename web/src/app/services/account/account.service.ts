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
    return this.post(this.profileUrl(), userData);
  }

  updateProfile (userData): Promise<any> {
    return this.put(this.profileUrl(), userData);
  }

  getProfile (): Promise<any> {
    return this.get(this.profileUrl());
  }

  validateUsername (username: string): Promise<any> {
    return this.get(this.usernameValidateUrl(username));
  }

  private usernameValidateUrl (username: string): string {
    let path = this._settingsService.app('usernameValidatePath')
      .replace(':username', encodeURIComponent(username));
    return this.url(path);
  }

  private profileUrl (): string {
    return this.url(this._settingsService.app('profilePath'));
  }

}
