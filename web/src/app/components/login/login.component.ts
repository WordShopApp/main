import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { LoggerService } from '../../services/logger/logger.service';
import { NavService } from '../../services/nav/nav.service';
import { AlertTypes } from '../alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;

  alertHeader: string;
  alertMessage: string;
  alertShow: boolean;
  alertType: string;

  constructor(
    private authService: AuthService,
    private loggerService: LoggerService,
    private navService: NavService) { }

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
          this.showAlert('Error:', 'There was a problem logging in. Please try again.', AlertTypes.Danger);
        }
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
