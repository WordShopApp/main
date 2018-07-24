import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class AccountService extends ApiService {

  constructor (
    authService: AuthService,
    http: HttpClient,
    settingsService: SettingsService,
    private loggerService: LoggerService,
  ) { 
    super(authService, http, settingsService);
  }

  createProfile (userData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loggerService.info('AccountService', 'Create Profile', userData);
      this.post(this.profileUrl(), userData).then(res => {
        let profile = res.json();
        this.loggerService.info('AccountService', 'Create Profile Success', profile);
        resolve(profile);
      }).catch(reject);
    });
  }

  getProfile (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loggerService.info('AccountService', 'Get Profile');
      this.get(this.profileUrl()).then(res => {
        let profile = res.json();
        this.loggerService.info('AccountService', 'Get Profile Success', profile);
        resolve(profile);
      }).catch(reject);
    });
  }

  private profileUrl (): string {
    return this.url(this._settingsService.app('profilePath'));
  }

}
