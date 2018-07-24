import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AlertTypes } from '../alert/alert.component';
import { NavService } from '../../services/nav/nav.service';
import { MessengerService } from '../../services/messenger/messenger.service';
import { LoggerService } from '../../services/logger/logger.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;
  @ViewChild('codeInput') codeInput: ElementRef;

  email: string;
  pswd: string;
  showResetForm: boolean;

  constructor(
    private authService: AuthService,
    private loggerService: LoggerService,
    private messengerService: MessengerService,
    private navService: NavService
  ) { }

  ngOnInit() {
  }

  sendVerificationCode (evt) {
    evt.preventDefault();
    this.email = this.emailInput.nativeElement.value;
    if (this.email) {
      this.authService.forgotPassword(this.email).then(res => {
        this.showResetForm = true;
        this.sendMessage(AlertTypes.Info, 'Email Sent:', 'A verification code was sent to the email address you provided. Use that code to reset your password.');
      }).catch(err => {
        this.sendMessage(AlertTypes.Danger, 'Error:', err.message);
        this.loggerService.error(err);
      });
    }
  }

  resetPassword (evt) {
    evt.preventDefault();
    this.pswd = this.passwordInput.nativeElement.value;
    let code = this.codeInput.nativeElement.value;
    this.email = this.email || this.emailInput.nativeElement.value;
    if (this.email && this.pswd && code) {
      this.authService.resetPassword(this.email, this.pswd, code).then(reset => {
        this.sendMessage(AlertTypes.Success, 'Success:', 'Your password has been reset.');
        this.login();
      }).catch(err => {
        this.sendMessage(AlertTypes.Danger, 'Error:', err.message);
        this.loggerService.error(err);
      });
    }
  }

  login () {
    this.authService.login(this.email, this.pswd).then(token => {
      if (token) this.navService.gotoRoot();
    }).catch(this.loggerService.error.bind(this));
  }

  sendMessage(type, header, message) {
    this.messengerService.send('global:alert', { type, header, message });
  }

  showCodeForm (evt, show) {
    evt.preventDefault();
    this.showResetForm = show;
  }

}
