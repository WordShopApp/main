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
      main_category: null,
      adult_category: null,
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

  categories = {
    'fiction': [
      { name: 'Adventure', value: 'adventure' },
      { name: 'Children', value: 'children' },
      { name: 'Comedy', value: 'comedy' },
      { name: 'Crime', value: 'crime' },
      { name: 'Drama', value: 'drama' },
      { name: 'Erotica', value: 'erotica' },
      { name: 'Existential', value: 'existential' },
      { name: 'Fan Fiction', value: 'fan-fiction' },
      { name: 'Fantasy', value: 'fantasy' },
      { name: 'Feminist', value: 'feminist' },
      { name: 'History', value: 'history' },
      { name: 'Horror', value: 'horror' },
      { name: 'LGBTQ', value: 'lgbtq' },
      { name: 'Magical Realism', value: 'magical-realism' },
      { name: 'Minority', value: 'minority' },
      { name: 'Mystery', value: 'mystery' },
      { name: 'Myth and Folklore', value: 'myth-and-folklore' },
      { name: 'Music', value: 'music' },
      { name: 'Mythopoeia', value: 'mythopoeia' },
      { name: 'Noir', value: 'noir' },
      { name: 'Pastoral', value: 'pastoral' },
      { name: 'Philosophy', value: 'philosphy' },
      { name: 'Political', value: 'political' },
      { name: 'Psychedelic', value: 'psychedelic' },
      { name: 'Religious', value: 'religious' },
      { name: 'Romance', value: 'romance' },
      { name: 'Rural', value: 'rural' },
      { name: 'Science Fiction', value: 'science-fiction' },
      { name: 'Spiritual', value: 'spiritual' },
      { name: 'Southern', value: 'southern' },
      { name: 'Surreal', value: 'surreal' },
      { name: 'Tall Tale', value: 'tall-tale' },
      { name: 'Technology', value: 'technology' },
      { name: 'Thriller', value: 'thriller' },
      { name: 'Tragedy', value: 'tragedy' },
      { name: 'Urban', value: 'urban' },
      { name: 'Weird', value: 'weird' }
    ],
    'non-fiction': [
      { name: 'Analysis', value: 'analysis' },
      { name: 'Art', value: 'art' },
      { name: 'Biography', value: 'biography' },
      { name: 'Blog', value: 'blog' },
      { name: 'Conservative', value: 'conservative' },
      { name: 'Critique', value: 'critique' },
      { name: 'Earth', value: 'earth' },
      { name: 'Education', value: 'education' },
      { name: 'Essay', value: 'essay' },
      { name: 'Feminist', value: 'feminist' },
      { name: 'Gaming', value: 'gaming' },
      { name: 'Guide', value: 'guide' },
      { name: 'History', value: 'history' },
      { name: 'Humor', value: 'humor' },
      { name: 'Journal', value: 'journal' },
      { name: 'LGBTQ', value: 'lgbtq' },
      { name: 'Liberal', value: 'liberal' },
      { name: 'Media', value: 'media' },
      { name: 'Memoir', value: 'memoir' },
      { name: 'Minority', value: 'minority' },
      { name: 'Music', value: 'music' },
      { name: 'Parenting', value: 'parenting' },
      { name: 'Philosophy', value: 'philosophy' },
      { name: 'Political', value: 'political' },
      { name: 'Recipe', value: 'recipe' },
      { name: 'Religious', value: 'religious' },
      { name: 'Review', value: 'review' },
      { name: 'Science', value: 'science' },
      { name: 'Space', value: 'space' },
      { name: 'Spiritual', value: 'spiritual' },
      { name: 'Technology', value: 'technology' }
    ],
    'poetry': [
      { name: 'Epic', value: 'epic' },
      { name: 'Free Verse', value: 'free-verse' },
      { name: 'Haiku', value: 'haiku' },
      { name: 'Narrative', value: 'narrative' },
      { name: 'Nonsense', value: 'nonsense' },
      { name: 'Rhyming', value: 'rhyming' },
      { name: 'Song', value: 'song' },
      { name: 'Spoken Word', value: 'spoken-word' }
    ]
  };

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
    return 4;
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
    this.project[this.step].main_category = category;
    this.stepFive_checkComplete();
  }

  private stepFive_adultCategoryChanged (category) {
    this.project[this.step].adult_category = category;
    this.stepFive_checkComplete();
  }

  private stepFive_categoryListChanged (list) {
    this.project[this.step].categories = list.map(i => i.value);
  }

  private stepFive_checkComplete () {
    let mainComplete = this.project[this.step].main_category ? true : false;
    let adultComplete = this.project[this.step].adult_category ? true : false;
    this.project[this.step].complete = (mainComplete && adultComplete);
  }

}
