import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {

  private appSettings = {
    profilePath: '/profile',
    usernameValidatePath: '/profile/validate-username/:username',
    projectPath: '/projects',
  };

  app (key): any {
    return this.appSettings[key];
  }

  env (key): any {
    return this.envSettings() && this.envSettings()[key];
  }

  appUrl (path: string = ''): string {
    return `${this.baseUrl()}${path}`;
  }

  private baseUrl (): string {
    return document.getElementsByTagName('base')[0].href;
  }

  private envSettings () {
    return window['ws'] && window['ws']['settings'];
  }

}
