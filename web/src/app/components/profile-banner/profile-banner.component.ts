import { Component, Input, OnInit } from '@angular/core';
import { WordIconService } from '../../services/word-icon/word-icon.service';
import { AlertTypes } from '../alert/alert.component';
import { MessengerService } from '../../services/messenger/messenger.service';
import { AccountService } from '../../services/account/account.service';
import { LoggerService } from '../../services/logger/logger.service';
import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.scss']
})
export class ProfileBannerComponent implements OnInit {

  @Input() profile: any;
  avatarPalette: any;

  editMode: boolean;
  saveEnabled: boolean;
  newUsername: string;

  constructor (
    private accountService: AccountService,
    private loggerService: LoggerService,
    private messengerService: MessengerService,
    private storeService: StoreService,
    private wordIconService: WordIconService
  ) { }

  ngOnInit() {
    this.setEditMode(false);
  }

  setEditMode (enabled: boolean) {
    this.editMode = enabled;
    if (!enabled) this.updateAvatarPalette(this.profile.username);
  }

  saveChanges () {
    if (this.saveEnabled) {
      this.accountService.updateProfile({ username: this.newUsername }).then(updated => {
        this.storeService.dispatch(Actions.Init.Profile, updated);
        this.setEditMode(false);
        this.updateAvatarPalette(updated.username);
      }).catch(err => {
        this.loggerService.error(err);
        this.sendMessage(AlertTypes.Danger, 'Error:', err.message);
        this.setEditMode(false);
      });
    }
  }

  validatorResults (res) {
    this.saveEnabled = res.valid;
    this.newUsername = res.username;
    this.updateAvatarPalette(res.username);
  }

  sendMessage(type, header, message) {
    this.messengerService.send('global:alert', { type, header, message });
  }

  updateAvatarPalette (username) {
    this.avatarPalette = this.wordIconService.getPalette(username);
  }

}
