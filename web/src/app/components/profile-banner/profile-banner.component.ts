import { Component, Input, OnInit } from '@angular/core';
import { WordIconService } from '../../services/word-icon/word-icon.service';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.scss']
})
export class ProfileBannerComponent implements OnInit {

  @Input() profile: any;
  avatarPalette: any;

  constructor (private settingsService: SettingsService, private wordIconService: WordIconService) { }

  ngOnInit() {
    this.updateAvatarPalette(this.profile.username);
  }

  updateAvatarPalette (username) {
    this.avatarPalette = this.wordIconService.getPalette(username);
  }

  assetUrl (path) {
    return this.settingsService.assetUrl(path);
  }

}
