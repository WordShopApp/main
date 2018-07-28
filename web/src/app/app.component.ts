import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { MessengerService } from './services/messenger/messenger.service';
import { NavService } from './services/nav/nav.service';
import { LoggerService } from './services/logger/logger.service';
import { StoreService } from './services/store/store.service';
import { StoreProps as Props } from './services/store/store.props';
import { StoreActions as Actions } from './services/store/store.actions';
import { AlertTypes } from './components/alert/alert.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {

  alertShow = false;
  alertMessage: string;
  alertHeader: string;
  alertType: string;

  profile: any;
  profile$: Subscription;

  loggedIn: boolean;
  loggedIn$: Subscription;

  showHomeIcon = false;
  showHomeIcon$: Subscription;

  constructor (
    private authService: AuthService,
    private loggerService: LoggerService,
    private messengerService: MessengerService,
    private navService: NavService,
    private storeService: StoreService
  ) {}

  ngOnInit () {
    this.storeService.init();
    this.setupSubscriptions();
    this.storeService.dispatch(Actions.Init.LoggedIn, this.storeService.local.get('token') ? true : false);
  }

  ngAfterViewInit () {}

  ngOnDestroy () {
    this.teardownSubscriptions();
  }

  logout (evt) {
    evt.preventDefault();
    this.authService.logout();
    this.navService.gotoLogin();
  }

  showAlert (opts) {
    if (opts) {
      this.alertShow = false;
      setTimeout(() => {
        this.alertMessage = opts.message;
        this.alertHeader = opts.header;
        this.alertType = opts.type;
        this.alertShow = true;
      }, 0);
    }
  }

  private setupSubscriptions () {
    this.messengerService.subscribe('global:alert', this.showAlert.bind(this));
    this.profile$ = this.storeService.subscribe(Props.App.Profile, p => this.profile = p);
    this.showHomeIcon$ = this.storeService.subscribe(Props.UI.ShowHomeIcon, shi => {
      if (shi === true || shi === false) setTimeout(() => this.showHomeIcon = shi, 0);
    });
    this.loggedIn$ = this.storeService.subscribe(Props.App.LoggedIn, li => this.loggedIn = li);
  }

  private teardownSubscriptions () {
    this.profile$.unsubscribe();
    this.showHomeIcon$.unsubscribe();
    this.loggedIn$.unsubscribe();
  }

}
