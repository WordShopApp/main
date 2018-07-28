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

  constructor (private wordIconService: WordIconService) { }

  ngOnInit() {
    this.avatarPalette = this.wordIconService.getPalette(this.profile.name);
  }

}
