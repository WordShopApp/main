import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { WordIconService } from '../../services/word-icon/word-icon.service';
import { AlertTypes } from '../alert/alert.component';
import { MessengerService } from '../../services/messenger/messenger.service';
import { AccountService } from '../../services/account/account.service';
import { LoggerService } from '../../services/logger/logger.service';
import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-project-banner',
  templateUrl: './project-banner.component.html',
  styleUrls: ['./project-banner.component.scss']
})
export class ProjectBannerComponent implements OnInit, OnChanges {

  @Input() project: any;
  palette: any;

  constructor (
    private settingsService: SettingsService,
    private wordIconService: WordIconService
  ) { }

  ngOnInit() {}

  ngOnChanges (changes: SimpleChanges) {
    if (this.project) this.updatePalette(this.project.title);
  }

  updatePalette (title) {
    this.palette = this.wordIconService.getPalette(title);
  }

  assetUrl (path) {
    return this.settingsService.assetUrl(path);
  }

}
