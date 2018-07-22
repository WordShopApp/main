import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { NavService } from './services/nav/nav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loggedIn: boolean;

  constructor (private authService: AuthService, private navService: NavService) {}

  ngOnInit () {
    this.loggedIn = this.authService.loggedIn();
    if (!this.loggedIn) this.navService.gotoWelcome();
  }

}
