import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store/store.service';
import { AuthService } from '../../services/auth/auth.service';
import { AlertTypes } from '../alert/alert.component';
import { NavService } from '../../services/nav/nav.service';
import { MessengerService } from '../../services/messenger/messenger.service';
import { LoggerService } from '../../services/logger/logger.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  email: string;
  password: string;

  constructor(
    private authService: AuthService,
    private loggerService: LoggerService,
    private messengerService: MessengerService,
    private navService: NavService,
    private storeService: StoreService
  ) { }

  ngOnInit () {
    this.email = this.storeService.local.get('email');
    this.password = this.storeService.local.get('password');
    if (this.email && this.password) {
      this.pollForLogin(this.email, this.password);
    } else {
      this.navService.gotoLogin();
    }
  }

  resendConfirmationEmail (evt) {
    evt.preventDefault();
    if (this.email) {
      this.authService.resendConfirmationEmail(this.email).then(res => {
        this.sendMessage(AlertTypes.Info, 'Email Sent:', `We sent another confirmation email to ${this.email}. Please check again.`);
      }).catch(err => {
        this.loggerService.error(err);
        this.sendMessage(AlertTypes.Danger, 'Error:', err.message);
      });
    }
  }

  pollForLogin (email, password) {
    this.tryLogIn(email, password).then(loggedIn => {
      if (loggedIn) {
        this.navService.gotoRoot();
      } else {
        setTimeout(() => this.pollForLogin(email, password), 1000);
      }
    }).catch(this.loggerService.error);
  }

  tryLogIn (email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.login(email, password).then(token => {
        resolve(true);
      }).catch(err => {
        resolve(false);
      });
    });
  }

  sendMessage(type, header, message) {
    this.messengerService.send('global:alert', { type, header, message });
  }

}
