import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // 'Account Created:', 'Please check your email for a confirmation link. You must confirm your email address before you can login.'
    // display information to check email, poll cognito for user confirmation status, when logged in remove creds from local storage
    // and log user in, redirect to dashboard
  }

}
