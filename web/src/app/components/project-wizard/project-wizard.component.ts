import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AccountService } from '../../services/account/account.service';
import { NavService } from '../../services/nav/nav.service';
import { StoreService } from '../../services/store/store.service';
import { StoreProps as Props } from '../../services/store/store.props';
import { WordIconService } from '../../services/word-icon/word-icon.service';

@Component({
  selector: 'app-project-wizard',
  templateUrl: './project-wizard.component.html',
  styleUrls: ['./project-wizard.component.scss']
})
export class ProjectWizardComponent implements OnInit, OnDestroy {

  project: any;
  step: number;
  palette: any;

  profile: any;
  profile$: Subscription;

  newProjectTemplate = [
    {
      name: 'Title',
      complete: null,
      title: null,
    },
    {
      name: 'Multipart',
      complete: null,
      multipart: null,
      part_name: null
    },
    {
      name: 'Text',
      complete: null,
      text: null
    },
    {
      name: 'Context',
      complete: true,
      context: null
    },
    {
      name: 'Categories',
      complete: null,
      categories: []
    },
    {
      name: 'Questions',
      complete: null,
      questions: []
    },
    {
      name: 'Access',
      complete: true,
      private: null,
    },
    {
      name: 'Review',
      complete: true
    }
  ];

  constructor (
    private accountService: AccountService,
    private navService: NavService,
    private storeService: StoreService,
    private wordIconService: WordIconService
  ) { }

  ngOnInit () {
    this.updateProjectPalette(null);
    this.setupSubscriptions();
  }

  ngOnDestroy () {
    this.teardownSubscriptions();
  }

  private setupProject () {
    this.project = this.profile.project_in_progress || this.newProjectTemplate;
    this.setCurrStep(this.getCurrStep(this.project));
  }

  private getCurrStep (project): number {
    let step = -1;
    for (let p = 0; p < project.length; p += 1) {
      if (!project[p].complete) {
        step = p;
        break;
      }
    }
    return step;
  }

  private setCurrStep (step) {
    if (step !== null) this.step = step;
  }

  private createProject () {
    this.navService.gotoRoot();
  }

  private setupSubscriptions () {
    this.profile$ = this.storeService.subscribe(Props.App.Profile, p => {
      this.profile = p && p.toJS();
      if (!this.project) this.setupProject();
    });
  }

  private teardownSubscriptions () {
    this.profile$.unsubscribe();
  }

  private updateProjectPalette (hash) {
    this.palette = this.wordIconService.getPalette(hash);
  }

  private stepOne_titleChanged (title) {
    this.project[this.step].title = title;
    this.project[this.step].complete = (title && title.length > 0) ? true : false;
    this.updateProjectPalette(title);
  }

  private stepTwo_multipartChanged (isMultipart) {
    this.project[this.step].multipart = (isMultipart === 'true') ? true : false;
    if (!this.project[this.step].multipart) this.stepTwo_partNameChanged(null);
    this.project[this.step].complete = true;
  }

  private stepTwo_partNameChanged (name) {
    this.project[this.step].part_name = name;
  }

  private stepThree_textChanged (res) {
    this.project[this.step].text = res.text;
    this.project[this.step].complete = 
      (res.word_count > 0 && res.word_count <= 5000) 
      ? true 
      : false;
  }

  private stepFour_contextChanged (res) {
    this.project[this.step].context = res.text;
    this.project[this.step].complete = 
      (res.word_count > 0 && res.word_count <= 300) 
      ? true 
      : false;
  }

  private removeItem (arr, item) {
    let index = arr.indexOf(item);
    if (index !== -1) arr.splice(index, 1);
  }

  private stepFive_mainCategoryChanged (category) {
    let categories = this.project[this.step].categories;
    if (categories.indexOf(category) === -1) categories.push(category);
    switch (category) {
      case 'fiction':
        this.removeItem(categories, 'non-fiction');
        this.removeItem(categories, 'poetry');
        break;
      case 'non-fiction':
      this.removeItem(categories, 'fiction');
      this.removeItem(categories, 'poetry');
        break;
      case 'poetry':
      this.removeItem(categories, 'fiction');
      this.removeItem(categories, 'non-fiction');
        break;
      default:
        break;
    }
    this.stepFive_checkComplete();
  }

  private stepFive_adultCategoryChanged (category) {
    let categories = this.project[this.step].categories;
    if (categories.indexOf(category) === -1) categories.push(category);
    let itemToRemove = category === 'adult' ? 'non-adult' : 'adult';
    this.removeItem(categories, itemToRemove);
    this.stepFive_checkComplete();
  }

  private stepFive_checkComplete () {
    let categories = this.project[this.step].categories;
    let mainComplete = (
      categories.indexOf('fiction') >= 0 || 
      categories.indexOf('non-fiction') >= 0 || 
      categories.indexOf('poetry') >= 0
    );
    let adultComplete = (
      categories.indexOf('adult') >= 0 || 
      categories.indexOf('non-adult') >= 0
    );
    this.project[this.step].complete = (mainComplete && adultComplete);
  }

}
