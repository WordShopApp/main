import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { MessengerService } from './services/messenger/messenger.service';
import { NavService } from './services/nav/nav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  alertShow = false;
  alertMessage: string;

  constructor (
    private authService: AuthService,
    private messengerService: MessengerService,
    private navService: NavService) {}

  ngOnInit () {
    this.messengerService.subscribe('global:alert', this.showAlert.bind(this));
    this.authService.loggedIn().then(loggedIn => {
      if (!loggedIn) this.navService.gotoWelcome();
    }).catch(console.error);
  }

  logout (evt) {
    evt.preventDefault();
    this.authService.logout();
    this.navService.gotoLogin();
  }

  showAlert (msg) {
    if (msg) {
      this.alertShow = false;
      setTimeout(() => {
        this.alertMessage = msg;
        this.alertShow = true;
      }, 0);
    }
  }

}
