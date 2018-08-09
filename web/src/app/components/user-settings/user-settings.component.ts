import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { AccountService } from '../../services/account/account.service';
import { AuthService } from '../../services/auth/auth.service';
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

  actionButtonLabel = 'Save Changes';
  accountSaveEnabled: boolean;

  enableAccountDelete: boolean;

  avatarPalette: any;

  showOldPassword = false;
  showNewPassword = false;
  @ViewChild('newPasswordInput') newPasswordInput: ElementRef;
  @ViewChild('oldPasswordInput') oldPasswordInput: ElementRef;

  constructor (
    private location: Location,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private authService: AuthService,
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
      }).catch(this.handleError);
    }
  }

  saveAccountChanges () {
    if (this.accountSaveEnabled) {
      let opswd = this.oldPasswordInput.nativeElement.value;
      let npswd = this.newPasswordInput.nativeElement.value;
      this.authService.changePassword(opswd, npswd).then(res => {
        this.sendMessage(AlertTypes.Success, 'Success:', 'Password has been updated');
        this.home();
      }).catch(this.handleError);
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

  validateDeleteAccount (evt) {
    let email = evt.target.value;
    if (email && this.profile) {
      this.enableAccountDelete = this.profile.email.toLowerCase() === email.toLowerCase();
    } else {
      this.enableAccountDelete = false;
    }
  }

  ignoreEnter (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  }

  deleteAccount (evt) {
    evt.preventDefault();
    this.authService.deleteUser().then(_ => {
      this.accountService.deleteProfile().then(res => {
        this.sendMessage(AlertTypes.Success, 'Success:', 'Your account has been deleted. Please join us again sometime!');
        this.authService.logout();
        this.home();
      }).catch(this.handleError);
    }).catch(this.handleError);
  }

  validatePasswords () {
    let opswd = this.oldPasswordInput.nativeElement.value;
    let npswd = this.newPasswordInput.nativeElement.value;
    this.accountSaveEnabled = opswd && npswd;
    if (this.accountSaveEnabled) {
      this.actionButtonLabel = 'Change Password';
    } else {
      this.actionButtonLabel = 'Save Changes';
    }
  }

  handleError (err) {
    this.loggerService.error(err);
    this.sendMessage(AlertTypes.Danger, 'Error:', err.message);
  }

}
