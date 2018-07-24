import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { MessengerService } from './services/messenger/messenger.service';
import { NavService } from './services/nav/nav.service';
import { LoggerService } from './services/logger/logger.service';
import { RosieService } from './services/rosie/rosie.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  alertShow = false;
  alertMessage: string;
  alertHeader: string;
  alertType: string;

  constructor (
    private authService: AuthService,
    private loggerService: LoggerService,
    private messengerService: MessengerService,
    private navService: NavService,
    private rosieService: RosieService
  ) {}

  ngOnInit () {
    this.messengerService.subscribe('global:alert', this.showAlert.bind(this));
    this.rosieService.cleanup();
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

}
