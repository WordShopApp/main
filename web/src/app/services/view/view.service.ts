import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class ViewService extends ApiService  {

  constructor (
    authService: AuthService,
    http: HttpClient,
    settingsService: SettingsService,
    private loggerService: LoggerService,
    private storeService: StoreService
  ) { 
    super(authService, http, settingsService);
  }

  init (): Promise<any> {
    let url = this.settingsService.app('viewInitPath');
    return this.get(url);
  }

  profile (username): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = this.settingsService
        .app('viewProfilePath')
        .replace(':username', username);
      return this.get(url);
    });
  }

  project (projectId): Promise<any> {
    let url = this.settingsService
      .app('viewProjectPath')
      .replace(':project_id', projectId);
    return this.get(url);
  }
}
