import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { LoggerService } from '../../services/logger/logger.service';
import { NavService } from '../../services/nav/nav.service';
import { AlertTypes } from '../alert/alert.component';
import { MessengerService } from '../../services/messenger/messenger.service';
import { StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showPassword = false;

  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;

  constructor(
    private authService: AuthService,
    private loggerService: LoggerService,
    private messengerService: MessengerService,
    private navService: NavService,
    private storeService: StoreService
  ) { }

  ngOnInit() {
  }

  login (evt) {
    evt.preventDefault();
    let email = this.emailInput.nativeElement.value;
    let password = this.passwordInput.nativeElement.value;
    if (email && password) {
      this.authService.login(email, password).then(token => {
        if (token) {
          this.navService.gotoRoot();
        } else {
          this.sendMessage(AlertTypes.Danger, 'Error:', 'There was a problem logging in. Please try again.');
        }
      }).catch(err => {
        this.sendMessage(AlertTypes.Danger, 'Error:', err.message);
        this.loggerService.error(err);
        if (this.isUnconfirmed(err.code)) {
          this.storeService.local.set('email', email);
          this.storeService.local.set('password', password);
          this.navService.gotoConfirmation();
        }
      });
    }
  }

  isUnconfirmed (code) {
    return code === 'UserNotConfirmedException';
  }

  sendMessage(type, header, message) {
    this.messengerService.send('global:alert', { type, header, message });
  }
}
