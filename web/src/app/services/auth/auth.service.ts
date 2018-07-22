import { Injectable } from '@angular/core';
import { CognitoService } from '../cognito/cognito.service';
import { LoggerService } from '../logger/logger.service';
import { StoreService } from '../store/store.service';

@Injectable()
export class AuthService {
  private authKey = 'auth';
  private tokenKey = 'token';
  private tokenDelimiter = ':';

  private providers: any;

  constructor (
    private cognitoService: CognitoService,
    private loggerService: LoggerService,
    private storeService: StoreService,
  ) { }

  canActivate () {
    this.loggerService.log('AuthService.canActivate', this.loggedIn());
    return this.loggedIn();
  }

  blank (str) {
    return !str || !str.length || str.trim().length === 0;
  }

  loggedIn () {
    let token = this.storeService.local.get(this.tokenKey);
    return !this.blank(token) ? true : false;
  }

  init () {
    this.initProviders();
  }

  signup (email, password): Promise<any> {
    return this.cognitoService.signup(email, password);
  }

  loginCognito (email, password): Promise<any> {
    return this.cognitoService.login(email, password);
  }

  initProviders () {
    this.providers = { };
    Object.keys(this.providers).map(key => this.providers[key].init());
  }

  login (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authToken().then(token => {
        if (token) {
          let provider = this.getProvider();
          this.loggerService.info('AuthService', 'Login Provider Token', provider, token);
          this.cognitoService.fetchCredentials(provider, token).then(creds => {
            this.loggerService.info('AuthService', 'Login Creds', creds);
            resolve(creds);
          }).catch(err => {
            this.loggerService.error('AuthService', 'Login Error', err);
            reject(err);
          });
        } else {
          this.loggerService.error('AuthService', 'Provider Token not found');
          reject(null);
        }
      }).catch(reject);
    });
  }

  logout (alsoProviders = true) {
    if (alsoProviders) Object.keys(this.providers).map(key => this.providers[key].logout());
    this.clearData();
  }

  details () {
    return new Promise((resolve, reject) => {
      let provider = this.getProvider();
      if (provider) {
        this.providers[provider].details().then(resolve).catch(reject);
      } else {
        reject('No auth provider found');
      }
    });
  }

  authToken () {
    return new Promise((resolve, reject) => {
      let key = this.getProvider();
      if (key) {
        this.providers[key].authToken().then(resolve).catch(reject);
      } else {
        reject(null);
      }
    });
  }

  getProvider () {
    this.loggerService.info('AuthService', 'Getting Provider');
    return this.getData();
  }

  setProvider (provider) {
    this.loggerService.info('AuthService', 'Setting Provider', provider);
    this.clearData();
    this.setData(provider);
  }

  getData () {
    return this.storeService.local.get(this.authKey) || null;
  }

  setData (data) {
    this.storeService.local.set(this.authKey, data);
  }

  clearData () {
    this.storeService.local.remove(this.authKey);
  }

}
