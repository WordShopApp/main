import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { LoggerService } from '../../services/logger/logger.service';
import { NavService } from '../../services/nav/nav.service';
import { AlertTypes } from '../alert/alert.component';
import { MessengerService } from '../../services/messenger/messenger.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;

  alertHeader: string;
  alertMessage: string;
  alertShow: boolean;
  alertType: string;

  constructor(
    private authService: AuthService,
    private loggerService: LoggerService,
    private navService: NavService,
    private messengerService: MessengerService) { }

  ngOnInit() {}

  createAccount (evt) {
    evt.preventDefault();
    let email = this.emailInput.nativeElement.value;
    let password = this.passwordInput.nativeElement.value;
    if (email && password) {
      this.authService.join(email, password).then(res => {
        this.messengerService.send('global:alert', 'Account Created. Please check your email for a confirmation link. You must confirm your email address before you can login.');
        this.navService.gotoLogin();
      }).catch(err => {
        this.loggerService.error(err);
        this.showAlert('Error:', err.message, AlertTypes.Danger);
      });
    }
  }

  private showAlert (header, message, type) {
    this.alertShow = false;
    setTimeout(() => {
      this.alertHeader = header;
      this.alertMessage = message;
      this.alertType = type;
      this.alertShow = true;
    }, 0);
  }

}
