import { Component, Input, OnInit } from '@angular/core';
import { WordIconService } from '../../services/word-icon/word-icon.service';
import { AlertTypes } from '../alert/alert.component';
import { MessengerService } from '../../services/messenger/messenger.service';

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

  constructor (private messengerService: MessengerService, private wordIconService: WordIconService) { }

  ngOnInit() {
    this.setEditMode(false);
    this.avatarPalette = this.wordIconService.getPalette(this.profile.username);
  }

  setEditMode (enabled: boolean) {
    this.editMode = enabled;
  }

  saveChanges () {
    if (this.saveEnabled) {
      console.log('saving changes...');
    }
  }

  validatorResults (res) {
    this.saveEnabled = res.valid;
    console.log('validator results', res);
  }

  sendMessage(type, header, message) {
    this.messengerService.send('global:alert', { type, header, message });
  }

}
