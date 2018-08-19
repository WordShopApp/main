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
export class CritiqueService extends ApiService  {

  constructor (
    authService: AuthService,
    http: HttpClient,
    settingsService: SettingsService,
    private loggerService: LoggerService,
    private storeService: StoreService
  ) { 
    super(authService, http, settingsService);
  }

  all (): Promise<any> {
    return this.get(`${this.critiqueUrl()}/mine`);
  }

  show (projectId): Promise<any> {
    return this.get(`${this.critiqueUrl()}/${projectId}`);
  }

  create (data): Promise<any> {
    return this.post(this.critiqueUrl(), data);
  }

  update (critiqueId, data): Promise<any> {
    return this.put(`${this.critiqueUrl()}/${critiqueId}`, data);
  }

  remove (critiqueId): Promise<any> {
    return this.delete(`${this.critiqueUrl()}/${critiqueId}`);
  }

  private critiqueUrl (): string {
    return this.url(this.settingsService.app('critiquePath'));
  }
}
