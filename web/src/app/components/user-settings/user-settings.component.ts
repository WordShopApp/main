import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { AccountService } from '../../services/account/account.service';
import { AlertTypes } from '../alert/alert.component';
import { LoggerService } from '../../services/logger/logger.service';
import { MessengerService } from '../../services/messenger/messenger.service';
import { NavService } from '../../services/nav/nav.service';
import { StoreService } from '../../services/store/store.service';
import { StoreProps as Props } from '../../services/store/store.props';
import { StoreActions as Actions } from '../../services/store/store.actions';
import { WordIconService } from '../../services/word-icon/word-icon.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  area: string;
  param$: Subscription;

  profile: any;
  profile$: Subscription;

  profileSaveEnabled: boolean;
  profileNewUsername: string;

  accountSaveEnabled: boolean;
  enableAccountDelete: boolean;

  avatarPalette: any;

  constructor (
    private location: Location,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private loggerService: LoggerService,
    private messengerService: MessengerService,
    private navService: NavService,
    private storeService: StoreService,
    private wordIconService: WordIconService
  ) { }

  ngOnInit() {
    this.param$ = this.route.paramMap.subscribe(params => {
      this.area = params.get('area');
    });
    this.profile$ = this.storeService.subscribe(Props.App.Profile, p => {
      this.profile = p && p.toJS();
      this.updateAvatarPalette(this.profile.username);
    });
  }

  ngOnDestroy () {
    this.param$.unsubscribe();
    this.profile$.unsubscribe();
  }

  home () {
    this.navService.gotoRoot();
  }

  saveProfileChanges () {
    if (this.profileSaveEnabled) {
      this.accountService.updateProfile({ username: this.profileNewUsername }).then(updated => {
        this.storeService.dispatch(Actions.Init.Profile, updated);
        this.home();
      }).catch(err => {
        this.loggerService.error(err);
        this.sendMessage(AlertTypes.Danger, 'Error:', err.message);
      });
    }
  }

  validationResults (res) {
    this.profileSaveEnabled = res.valid;
    this.profileNewUsername = res.username;
  }

  usernameChanged (name) {
    this.updateAvatarPalette(name);
  }

  updateAvatarPalette (hash) {
    this.avatarPalette = this.wordIconService.getPalette(hash);
  }

  sendMessage(type, header, message) {
    this.messengerService.send('global:alert', { type, header, message });
  }

  validateDeleteAccount (email) {
    if (email && this.profile) {
      this.enableAccountDelete = this.profile.email.toLowerCase() === email.toLowerCase();
    } else {
      this.enableAccountDelete = false;
    }
  }

  deleteAccount (evt) {
    evt.preventDefault();
    console.log('deleteAccount');
  }

}
