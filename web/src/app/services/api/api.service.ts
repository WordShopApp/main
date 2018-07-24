import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class ApiService {

  constructor (
    private authService: AuthService,
    protected _http: HttpClient,
    protected _settingsService: SettingsService
  ) { }

  url (path, opts?) {
    let wsHost = this._settingsService.env('wsHost') || 'api';
    let wsDomain = this._settingsService.env('wsDomain') || 'wordshop.app';
    let wsProtocol = this._settingsService.env('wsProtocol') || 'https';

    if (opts && opts.host) { 
      wsHost = opts.host;
      delete opts.host;
    }
    if (opts && opts.domain) { 
      wsDomain = opts.domain;
      delete opts.domain;
    }
    if (opts && opts.protocol) { 
      wsProtocol = opts.protocol;
      delete opts.protocol;
    }

    let template = `${wsProtocol}://${wsHost}.${wsDomain}${path}`;

    // clone the input opts so we can use it for scratch work
    let workingOpts = Object.assign({}, opts);
    let templateVars = template.match(/:[^\/$\?\#\&]+/g);

    if (templateVars) {
      // perform the var substitution from the opts object
      for (let v of templateVars) {
        let varName = v.substr(1);
        template = template.replace(v, workingOpts[varName] || '');
        delete workingOpts[varName];
      }
    }

    template = this.removeTrailingSlash(template);

    // find the options that weren't used in the variable substitution
    let params = Object.keys(workingOpts);

    // now add on the parameters to the query string
    if (params.length > 0) {
      if (template.includes('?')) {
        template += '&';
      } else {
        template += '?';
      }

      for (let _i = 0; _i < params.length; ++_i) {
        let v = params[_i];
        template += `${v}=${opts[v]}`;
        if (_i !== params.length - 1) template += '&';
      }
    }

    return template;
  }

  removeTrailingSlash(url) {
    while (url[url.length - 1] === '/') {
      url = url.substr(0, url.length - 1);
    }

    // if there's a query string, remove slashes preceding that
    let _i = url.indexOf('?') - 1;
    while (_i >= 0 && url[_i] === '/') {
      url = url.substr(0, _i) + url.substr(_i + 1);
    }
    
    return url;
  }

  get (url, opts?: any): Promise<any> {
    return new Promise((_, reject) => {
      this.authService.token().then(token => {
        return this._http.get(url, this.apiOpts(token, opts)).toPromise();
      }).catch(reject);
    });
  }

  post (url, body, opts?: any): Promise<any> {
    return new Promise((_, reject) => {
      this.authService.token().then(token => {
        return this._http.post(url, body, this.apiOpts(token, opts)).toPromise();
      }).catch(reject);
    });
  }

  put (url, body, opts?: any): Promise<any> {
    return new Promise((_, reject) => {
      this.authService.token().then(token => {
        return this._http.put(url, body, this.apiOpts(token, opts)).toPromise();
      }).catch(reject);
    });
  }

  delete (url, opts?: any): Promise<any> {
    return new Promise((_, reject) => {
      this.authService.token().then(token => {
        return this._http.delete(url, this.apiOpts(token, opts)).toPromise();
      }).catch(reject);
    });
  }

  jsonHeaders () {
    return new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8'
    });
  }

  private apiOpts (token, opts) {
    opts = opts || { headers: this.jsonHeaders() };
    opts.headers.set('Authorization', token);
    return opts;
  }

}
