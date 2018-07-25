import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { LoggerService } from '../../services/logger/logger.service';
import { NavService } from '../../services/nav/nav.service';
import { AlertTypes } from '../alert/alert.component';
import { MessengerService } from '../../services/messenger/messenger.service';
import { StoreService } from '../../services/store/store.service';
import { AccountService } from '../../services/account/account.service';
import { GravatarService } from '../../services/gravatar/gravatar.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;
  @ViewChild('joinMailingListInput') joinMailingListInput: ElementRef;

  showPassword = false;
  
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private gravatarService: GravatarService,
    private loggerService: LoggerService,
    private navService: NavService,
    private messengerService: MessengerService,
    private storeService: StoreService
  ) { }

  ngOnInit() {}

  createAccount (evt) {
    evt.preventDefault();

    let email = this.emailInput.nativeElement.value;
    let password = this.passwordInput.nativeElement.value;
    let joinMailingList = this.joinMailingListInput.nativeElement.checked ? true : false;

    if (email && password) {
      this.authService.join(email, password).then(acct => {
        this.saveTempRegInfo(email, password, acct.userSub, joinMailingList);
        this.navService.gotoConfirmation();
      }).catch(err => {
        this.sendMessage(AlertTypes.Danger, 'Error:', err.message);
        this.loggerService.error(err);
      });
    }
  }

  saveTempRegInfo (email, password, subscription, joinMailingList) {
    this.storeService.local.set('email', email);
    this.storeService.local.set('password', password);
    this.storeService.local.set('subscription', subscription);
    this.storeService.local.set('joinMailingList', joinMailingList);
  }

  handleError (err) {
    this.messengerService.send('global:alert', { 
      type: AlertTypes.Danger,
      header: 'Error:',
      message: err.message 
    });
    this.loggerService.error(err);
  }

  sendMessage(type, header, message) {
    this.messengerService.send('global:alert', { type, header, message });
  }

}
