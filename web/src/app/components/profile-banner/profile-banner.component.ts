import { Component, Input, OnInit } from '@angular/core';
import { WordIconService } from '../../services/word-icon/word-icon.service';

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.scss']
})
export class ProfileBannerComponent implements OnInit {

  @Input() profile: any;
  avatarPalette: any;

  editMode: boolean;

  constructor (private wordIconService: WordIconService) { }

  ngOnInit() {
    this.setEditMode(false);
    this.avatarPalette = this.wordIconService.getPalette(this.profile.username);
  }

  setEditMode (enabled: boolean) {
    this.editMode = enabled;
  }

}
