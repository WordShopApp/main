import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import * as moment from 'moment';

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
import { ImageService } from '../../services/image/image.service';
import { S3Service } from '../../services/s3/s3.service';
import { SettingsService } from '../../services/settings/settings.service';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-project-config',
  templateUrl: './project-config.component.html',
  styleUrls: ['./project-config.component.scss']
})
export class ProjectConfigComponent implements OnInit, OnDestroy {

  param$: Subscription;

  area: string;

  projectId: any;
  project: any;

  projectSaveText = 'Save Changes';

  newTitle: string;
  titleValid: boolean;
  titleSaveInProgress: boolean;

  imagePalette: any;

  constructor (
    private route: ActivatedRoute,
    private accountService: AccountService,
    private authService: AuthService,
    private imageService: ImageService,
    private loggerService: LoggerService,
    private messengerService: MessengerService,
    private navService: NavService,
    private projectService: ProjectService,
    private s3Service: S3Service,
    private settingsService: SettingsService,
    private storeService: StoreService,
    private wordIconService: WordIconService
  ) { }

  ngOnInit () {
    this.param$ = this.route.params.subscribe(params => {
      this.area = params['area'];
      this.projectId = params['id'];
      this.projectService.show(this.projectId).then(proj => {
        this.project = proj;
        this.updateImagePalette(this.project.title);
      }).catch(err => {
        this.loggerService.error(err);
      });
    });
  }

  ngOnDestroy () {
    this.param$.unsubscribe();
  }

  setActiveArea (area) {
    this.navService.gotoProjectConfig(this.projectId, area);
  }

  backToProject () {
    this.navService.gotoProject(this.projectId);
  }

  sendMessage(type, header, message) {
    this.messengerService.send('global:alert', { type, header, message });
  }

  handleError (err) {
    this.loggerService.error(err);
    this.sendMessage(AlertTypes.Danger, 'Error:', err.message);
  }

  /* Project Config */

  validateTitle (title) {
    this.newTitle = title;
    this.titleValid = (title && title !== this.project.title) ? true : false;
    this.updateImagePalette(title);
  }

  updateImagePalette (title) {
    this.imagePalette = this.wordIconService.getPalette(title);
  }

  readyToSaveProject (): boolean {
    return this.titleValid && !this.titleSaveInProgress;
  }

  hasTitleChanges (): boolean {
    return this.titleValid;
  }

  saveTitleChanges () {
    this.projectSaveText = 'Saving';
    this.titleSaveInProgress = true;
    this.projectService.update(this.projectId, { title: this.newTitle })
      .then(updated => {
        this.newTitle = null;
        this.checkProjectSaveComplete();
      }).catch(err => {
        this.projectSaveText = 'Save Changes';
        this.titleSaveInProgress = false;
        this.handleError(err);
      });
  }

  saveProject () {
    if (this.readyToSaveProject()) {
      if (this.hasTitleChanges()) this.saveTitleChanges();
    }
  }

  checkProjectSaveComplete () {
    let titleComplete = this.titleSaveInProgress && this.newTitle === null;
    if (titleComplete) {
      this.projectSaveText = 'Save Changes';
      this.titleSaveInProgress = false;
      this.backToProject();
    }
  }

  /* / Project Config */

}
