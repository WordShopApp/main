import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { AccountService } from '../../services/account/account.service';
import { AuthService } from '../../services/auth/auth.service';
import { AlertTypes } from '../alert/alert.component';
import { LoggerService } from '../../services/logger/logger.service';
import { MessengerService } from '../../services/messenger/messenger.service';
import { NavService } from '../../services/nav/nav.service';
import { ProjectService } from '../../services/project/project.service';
import { StoreService } from '../../services/store/store.service';
import { StoreProps as Props } from '../../services/store/store.props';
import { StoreActions as Actions } from '../../services/store/store.actions';
import { WordIconService } from '../../services/word-icon/word-icon.service';
import { ViewService } from '../../services/view/view.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {

  param$: Subscription;
  projectId: any;

  project: any;
  user: any;
  critiques: any;

  showCritiqueEditor: boolean;

  constructor (
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private loggerService: LoggerService,
    private projectService: ProjectService,
    private viewService: ViewService
   ) { }

  ngOnInit () {
    this.param$ = this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      this.viewService.project(this.projectId).then(data => {
        this.project = data.project;
        this.user = data.user;
        this.critiques = data.critiques;
      }).catch(err => {
        this.loggerService.error(err);
      });
    });
  }

  ngOnDestroy () {
    this.param$.unsubscribe();
  }

  format (html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  newCritiqueSubmitted (critique) {
    this.showCritiqueEditor = false;
  }

  onCritiqueClicked () {
    this.showCritiqueEditor = true;
    document.getElementById('js-critique-editor').scrollIntoView();
  }

}
