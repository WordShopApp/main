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

declare var $;

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
  projectSaveEnabled: boolean;

  newTitle: string;
  titleValid: boolean;
  titleSaveInProgress: boolean;

  imageCropper: any;
  imagePalette: any;
  imageData: any;
  imageCanvas: HTMLCanvasElement;
  imageSaveInProgress: boolean;

  newTextResults: any;
  textSaveInProgress: boolean;

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
        this.setupImageCropper();
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
    this.updateProjectSaveEnabled();
  }

  updateImagePalette (title) {
    this.imagePalette = this.wordIconService.getPalette(title);
  }

  readyToSaveProject (): boolean {
    return this.titleValid && !this.titleSaveInProgress ||
           this.imageData && !this.imageSaveInProgress ||
           this.newTextResults && !this.textSaveInProgress;
  }

  hasTitleChanges (): boolean {
    return this.titleValid;
  }

  saveTitleChanges () {
    this.projectSaveText = 'Saving';
    this.titleSaveInProgress = true;
    this.projectService.update(this.projectId, { title: this.newTitle })
      .then(_ => {
        this.newTitle = null;
        this.checkProjectSaveComplete();
      }).catch(err => {
        this.projectSaveText = 'Save Changes';
        this.titleSaveInProgress = false;
        this.handleError(err);
      });
  }

  imageSaveError (err) {
    this.projectSaveText = 'Save Changes';
    this.imageSaveInProgress = false;
    this.handleError(err);
  }

  imageUploadParams (userId, projectId, timestamp, size, data) {
    return {
      Bucket: 'store.wordshop.app',
      Key: `usr:${userId}/prj:${projectId}/${timestamp}-${size}.jpg`,
      Body: data,
      ContentType: 'image/jpeg',
      CacheControl: 'max-age=31536000',
      Expires: moment().add(1, 'month').toDate(),
      ACL: 'public-read'
    };
  }

  saveImageChanges () {
    this.projectSaveText = 'Saving';
    this.imageSaveInProgress = true;

    // 1) resize avatar and convert to blobs
    Promise.all([
      this.imageService.blob(this.imageCanvas),
      this.imageService.copyAndResizeToBlob(this.imageCanvas, 200, 200, true),
      this.imageService.copyAndResizeToBlob(this.imageCanvas, 100, 100, true),
      this.imageService.copyAndResizeToBlob(this.imageCanvas, 50, 50, true)
    ]).then(blobs => {
      let now = (new Date()).valueOf();
      let userId = this.project.user_id;

      // 2) upload blobs as images to s3 bucket
      Promise.all([
        this.s3Service.upload(this.imageUploadParams(userId, this.projectId, now, 400, blobs[0])),
        this.s3Service.upload(this.imageUploadParams(userId, this.projectId, now, 200, blobs[1])),
        this.s3Service.upload(this.imageUploadParams(userId, this.projectId, now, 100, blobs[2])),
        this.s3Service.upload(this.imageUploadParams(userId, this.projectId, now, 50, blobs[3]))
      ]).then(_ => {

        // 3) update profile with path to the images
        this.projectService.update(this.projectId, { 
          image: `usr:${userId}/prj:${this.projectId}/${now}-{{size}}.jpg`
        }).then(updated => {

          // 4) complete
          this.imageCanvas = null;
          this.checkProjectSaveComplete();
        }).catch(this.imageSaveError.bind(this));
      }).catch(this.imageSaveError.bind(this));
    }).catch(this.imageSaveError.bind(this));
  }

  hasTextChanges (): boolean {
    return this.newTextResults ? true : false;
  }

  saveTextChanges () {
    this.projectSaveText = 'Saving';
    this.textSaveInProgress = true;
    let prjId = this.projectId;
    let prtId = this.project.parts[0].part_id;
    let verId = this.project.parts[0].versions[0].version_id;
    this.projectService
      .updateText(prjId, {
        text: this.newTextResults.text,
        word_count: this.newTextResults.word_count,
        project_id: prjId,
        part_id: prtId,
        version_id: verId
      })
      .then(_ => {
        this.newTextResults = null;
        this.checkProjectSaveComplete();
      }).catch(err => {
        this.projectSaveText = 'Save Changes';
        this.textSaveInProgress = false;
        this.handleError(err);
      });
  }

  saveProject () {
    if (this.readyToSaveProject()) {
      if (this.hasTitleChanges()) this.saveTitleChanges();
      if (this.hasImageChanges()) this.saveImageChanges();
      if (this.hasTextChanges()) this.saveTextChanges();
    }
  }

  checkProjectSaveComplete () {
    let titleComplete = (!this.titleSaveInProgress || (this.titleSaveInProgress && this.newTitle === null));
    let imageComplete = (!this.imageSaveInProgress || (this.imageSaveInProgress && this.imageCanvas === null));
    let textComplete = (!this.textSaveInProgress || (this.textSaveInProgress && this.newTextResults === null));
    if (titleComplete && imageComplete && textComplete) {
      this.projectSaveText = 'Save Changes';
      this.titleSaveInProgress = false;
      this.imageSaveInProgress = false;
      this.textSaveInProgress = false;
      this.backToProject();
    }
  }

  updateProjectSaveEnabled () {
    this.projectSaveEnabled = 
      (this.hasTitleChanges() || 
       this.hasImageChanges() || 
       this.hasTextChanges()) ? true : false;
  }

  hasImageChanges (): boolean {
    return this.imageCanvas ? true : false;
  }

  assetUrl (path) {
    return this.settingsService.assetUrl(path);
  }

  showImageModal (show: boolean, cb = null) {
    let sel = '#ui-image-crop-modal';
    if (show) {
      let sevt = 'shown.bs.modal';
      if (cb) $(sel).on(sevt, () => {
        cb();
        $(sel).off(sevt);
      });
      $(sel).modal({ backdrop: 'static' });
    } else {
      let hevt = 'hidden.bs.modal';
      if (cb) $(sel).on(hevt, () => {
        cb();
        $(sel).off(hevt);
      });
      $(sel).modal('hide');
    }
  }

  getEventFile (evt) {
    return evt && evt.target && evt.target['files'] && evt.target['files'][0];
  }

  projectImageChosen (evt) {
    let file = this.getEventFile(evt);
    if (file) {
      this.imageData = null;
      let reader = new FileReader();
      reader.onload = e => {
        this.imageCropper.bind({ url: e.target['result'] });
      };
      reader.readAsDataURL(file);
      this.showImageModal(true);
    } else {
      this.loggerService.error('Sorry, your browser does not support the FileReader API');
    }
  }

  doneCroppingImage () {
    this.imageCropper.result({
      type: 'rawcanvas',
      size: { width: 400, height: 400 },
      format: 'jpeg',
      quality: 1,
      circle: false
    }).then(canvas => {
      this.imageCanvas = canvas;
      this.updateProjectSaveEnabled();
    }).catch(this.loggerService.error.bind(this));
    this.imageCropper.result({
      type: 'base64',
      size: { width: 400, height: 400 },
      format: 'jpeg',
      quality: 1,
      circle: false
    }).then(data => {
      this.imageData = data;
      this.showImageModal(false);
    }).catch(this.loggerService.error.bind(this));
  }

  removeProjectImage () {
    let remove = window.confirm('Are you sure you want to remove the project image?');
    if (remove) {
      this.projectService.update(this.projectId, { 
        image: null
      }).then(_ => {
        this.project.image = null;
        this.imageData = null;
      }).catch(err => {
        this.handleError(err);
      });
    }
  }

  setupImageCropper () {
    if (!this.imageCropper) {
      let el = document.getElementById('ui-image-crop');
      this.imageCropper = new window['Croppie'](el, {
        enableExif: true,
        viewport: {
          width: 200,
          height: 200,
          type: 'circle'
        },
        boundary: {
          width: 200,
          height: 200
        }
      });
    }
  }

  deleteProject () {
    let remove = window.confirm('Are you sure you want to delete this project?');
    if (remove) {
      this.projectService.remove(this.projectId)
      .then(_ => {
        this.navService.gotoRoot();
      }).catch(err => {
        this.handleError(err);
      });
    }
  }

  textChanged (results) {
    if (results && results.word_count <= 5000) {
      this.newTextResults = results;
      this.updateProjectSaveEnabled();
    }
  }

  /* / Project Config */

}
