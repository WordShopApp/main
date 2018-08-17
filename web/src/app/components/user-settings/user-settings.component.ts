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

declare var $;

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

  usernameSaveInProgress: boolean;
  avatarSaveInProgress: boolean;
  profileSaveText = 'Save Changes';

  usernameResults: any;

  avatarPalette: any;
  avatarCropper: any;
  avatarCanvas: HTMLCanvasElement;
  avatarData: any;

  actionButtonLabel = 'Save Changes';
  accountSaveEnabled: boolean;

  enableAccountDelete: boolean;

  showOldPassword = false;
  showNewPassword = false;
  @ViewChild('newPasswordInput') newPasswordInput: ElementRef;
  @ViewChild('oldPasswordInput') oldPasswordInput: ElementRef;

  constructor (
    private route: ActivatedRoute,
    private accountService: AccountService,
    private authService: AuthService,
    private imageService: ImageService,
    private loggerService: LoggerService,
    private messengerService: MessengerService,
    private navService: NavService,
    private s3Service: S3Service,
    private settingsService: SettingsService,
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
    this.setupAvatarCropper();
  }

  ngOnDestroy () {
    this.param$.unsubscribe();
    this.profile$.unsubscribe();
  }

  goHome () {
    this.navService.gotoRoot();
  }

  sendMessage(type, header, message) {
    this.messengerService.send('global:alert', { type, header, message });
  }

  handleError (err) {
    this.loggerService.error(err);
    this.sendMessage(AlertTypes.Danger, 'Error:', err.message);
  }

  /* Profile Settings */

  setupAvatarCropper () {
    let el = document.getElementById('ui-avatar-crop');
    this.avatarCropper = new window['Croppie'](el, {
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

  avatarUploadParams (userId, timestamp, size, data) {
    return {
      Bucket: 'store.wordshop.app',
      Key: `usr:${userId}/${timestamp}-${size}.jpg`,
      Body: data,
      ContentType: 'image/jpeg',
      CacheControl: 'max-age=31536000',
      Expires: moment().add(1, 'month').toDate(),
      ACL: 'public-read'
    };
  }

  avatarSaveError (err) {
    this.profileSaveText = 'Save Changes';
    this.avatarSaveInProgress = false;
    this.handleError(err);
  }

  hasAvatarChanges (): boolean {
    return this.avatarCanvas ? true : false;
  }

  saveAvatarChanges () {
    this.profileSaveText = 'Saving';
    this.avatarSaveInProgress = true;

    // 1) resize avatar and convert to blobs
    Promise.all([
      this.imageService.blob(this.avatarCanvas),
      this.imageService.copyAndResizeToBlob(this.avatarCanvas, 200, 200, true),
      this.imageService.copyAndResizeToBlob(this.avatarCanvas, 100, 100, true),
      this.imageService.copyAndResizeToBlob(this.avatarCanvas, 50, 50, true)
    ]).then(blobs => {
      let now = (new Date()).valueOf();
      let userId = this.profile.user_id;

      // 2) upload blobs as images to s3 bucket
      Promise.all([
        this.s3Service.upload(this.avatarUploadParams(userId, now, 400, blobs[0])),
        this.s3Service.upload(this.avatarUploadParams(userId, now, 200, blobs[1])),
        this.s3Service.upload(this.avatarUploadParams(userId, now, 100, blobs[2])),
        this.s3Service.upload(this.avatarUploadParams(userId, now, 50, blobs[3]))
      ]).then(_ => {

        // 3) update profile with path to the images
        this.accountService.updateProfile({ 
          avatar: `usr:${userId}/${now}-{{size}}.jpg`
        }).then(updated => {

          // 4) update profile in local store
          this.storeService.dispatch(Actions.Init.Profile, updated);
          this.avatarCanvas = null;

          // 5) complete
          this.checkProfileSaveComplete();
        }).catch(this.avatarSaveError.bind(this));
      }).catch(this.avatarSaveError.bind(this));
    }).catch(this.avatarSaveError.bind(this));
  }

  hasUsernameChanges (): boolean {
    return this.usernameResults && this.usernameResults.valid ? true : false;
  }

  saveUsernameChanges () {
    this.profileSaveText = 'Saving';
    this.usernameSaveInProgress = true;
    this.accountService.updateProfile({ 
      username: this.usernameResults.username 
    }).then(updated => {
      this.usernameResults = null;
      this.storeService.dispatch(Actions.Init.Profile, updated);
      this.checkProfileSaveComplete();
    }).catch(err => {
      this.profileSaveText = 'Save Changes';
      this.usernameSaveInProgress = false;
      this.handleError(err);
    });
  }

  readyToSaveChanges (): boolean {
    return this.profileSaveEnabled
           && (!this.usernameSaveInProgress || !this.avatarSaveInProgress)
           ? true : false;
  }

  saveProfileChanges () {
    if (this.readyToSaveChanges()) {
      if (this.hasUsernameChanges()) this.saveUsernameChanges();
      if (this.hasAvatarChanges()) this.saveAvatarChanges();
    }
  }

  checkProfileSaveComplete () {
    let usernameComplete = (!this.usernameSaveInProgress || 
      (this.usernameSaveInProgress && this.usernameResults === null));
    let avatarComplete = (!this.avatarSaveInProgress || 
      (this.avatarSaveInProgress && this.avatarCanvas === null));
    if (usernameComplete && avatarComplete) {
      this.profileSaveText = 'Save Changes';
      this.usernameSaveInProgress = false;
      this.avatarSaveInProgress = false;
      this.goHome();
    }
  }

  validationResults (res) {
    this.usernameResults = res;
    this.updateProfileSaveEnabled();
  }

  updateProfileSaveEnabled () {
    this.profileSaveEnabled = this.avatarCanvas || 
      (this.usernameResults && this.usernameResults.valid);
  }

  usernameChanged (name) {
    this.updateAvatarPalette(name);
  }

  updateAvatarPalette (hash) {
    this.avatarPalette = this.wordIconService.getPalette(hash);
  }

  showAvatarModal (show: boolean, cb = null) {
    let sel = '#ui-avatar-crop-modal';
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

  avatarImageChosen (evt) {
    let file = this.getEventFile(evt);
    if (file) {
      this.avatarData = null;
      let reader = new FileReader();
      reader.onload = e => {
        this.avatarCropper.bind({ url: e.target['result'] });
      };
      reader.readAsDataURL(file);
      this.showAvatarModal(true);
    } else {
      this.loggerService.error('Sorry, your browser does not support the FileReader API');
    }
  }

  doneCroppingAvatar () {
    this.avatarCropper.result({
      type: 'rawcanvas',
      size: { width: 400, height: 400 },
      format: 'jpeg',
      quality: 1,
      circle: false
    }).then(canvas => {
      this.avatarCanvas = canvas;
      this.updateProfileSaveEnabled();
    }).catch(this.loggerService.error.bind(this));
    this.avatarCropper.result({
      type: 'base64',
      size: { width: 400, height: 400 },
      format: 'jpeg',
      quality: 1,
      circle: false
    }).then(data => {
      this.avatarData = data;
      this.showAvatarModal(false);
    }).catch(this.loggerService.error.bind(this));
  }

  removeAvatar () {
    let remove = window.confirm('Are you sure you want to remove your avatar?');
    if (remove) {
      this.accountService.updateProfile({ 
        avatar: null
      }).then(updated => {
        this.storeService.dispatch(Actions.Init.Profile, updated);
      }).catch(err => {
        this.handleError(err);
      });
    }
  }

  assetUrl (path) {
    return this.settingsService.assetUrl(path);
  }

   /* / Profile Settings */

   /* Account Settings */

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

  saveAccountChanges () {
    if (this.accountSaveEnabled) {
      let opswd = this.oldPasswordInput.nativeElement.value;
      let npswd = this.newPasswordInput.nativeElement.value;
      this.authService.changePassword(opswd, npswd).then(res => {
        this.sendMessage(AlertTypes.Success, 'Success:', 'Password has been updated');
        this.goHome();
      }).catch(this.handleError.bind(this));
    }
  }

  deleteAccount (evt) {
    evt.preventDefault();
    this.accountService.deleteProfile().then(dp_res => {
      this.authService.deleteUser().then(du_res => {
        this.sendMessage(
          AlertTypes.Success,
          'Success:', 
          'Your account has been deleted. Please join us again sometime!'
        );
        this.authService.logout();
        this.navService.gotoWelcome();
      }).catch(this.handleError.bind(this));
    }).catch(this.handleError.bind(this));
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

  /* / Account Settings */

}
