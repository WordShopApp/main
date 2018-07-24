import { Injectable } from '@angular/core';
import { CognitoService } from '../cognito/cognito.service';
import { LoggerService } from '../logger/logger.service';
import { NavService } from '../nav/nav.service';
import { StoreService } from '../store/store.service';

@Injectable()
export class AuthService {
  private authKey = 'auth';
  private tokenKey = 'token';

  private providers: any;

  constructor (
    private cognitoService: CognitoService,
    private loggerService: LoggerService,
    private navService: NavService,
    private storeService: StoreService,
  ) { }

  canActivate (): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.loggedIn().then(is => {
        if (!is) this.navService.gotoWelcome();
        resolve(is);
      }).catch(reject);
    });
  }

  blank (str) {
    return !str || !str.length || str.trim().length === 0;
  }

  loggedIn (): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.cognitoService.token().then(token => {
        resolve(token ? true : false);
      }).catch(err => {
        this.loggerService.error(err);
        resolve(false);
      });
    });
  }

  init () {
    this.initProviders();
  }

  join (email, password): Promise<any> {
    return this.cognitoService.join(email, password);
  }

  login (email, password): Promise<any> {
    return this.cognitoService.login(email, password);
  }

  forgotPassword (email): Promise<any> {
    return this.cognitoService.forgotPassword(email);
  }

  resetPassword (email, newPassword, verificationCode): Promise<any> {
    return this.cognitoService.resetPassword(email, newPassword, verificationCode);
  }

  resendConfirmationEmail (email): Promise<any> {
    return this.cognitoService.resendConfirmationEmail(email);
  }

  loginCognito (email, password): Promise<any> {
    return this.cognitoService.login(email, password);
  }

  initProviders () {
    this.providers = { };
    Object.keys(this.providers).map(key => this.providers[key].init());
  }

  loginOld (): Promise<any> {
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

  token (): Promise<any> {
    return this.cognitoService.token();
  }

  logout () {
    this.cognitoService.logout();
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
