import { Component, EventEmitter, Input, Output, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-critique-editor',
  templateUrl: './critique-editor.component.html',
  styleUrls: ['./critique-editor.component.scss']
})
export class CritiqueEditorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() project: any;
  @Input() part: any;
  @Input() version: any;

  @Output() cancelled = new EventEmitter<any>();
  @Output() submitted = new EventEmitter<any>();

  critique: any;
  ableToSubmit: boolean;
  submitInProgress: boolean;
  maxQuestionLength = 500;
  
  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit() {
  }

  ngOnChanges (changes: SimpleChanges) {
    if (!this.critique) this.initCritique();
  }

  ngOnDestroy() {
  }

  initCritique () {
    let existingCritique = this.storeService.local.get(this.critiqueKey());
    if (existingCritique) {
      this.critique = JSON.parse(existingCritique);
    } else {
      this.critique = [];
      this.part.questions.map(q => this.critique.push(this.critiqueItem(q, null, true)));
      this.critique.push(this.critiqueItem('General Feedback', null, false));
    }
    this.updateAbleToSubmit();
  }

  critiqueItem (question, answer, required) {
    return {
      question,
      answer,
      required
    };
  }

  textChanged (idx, answer) {
    if (answer.word_count <= this.maxQuestionLength) {
      this.critique[idx].answer = answer.text;
      this.saveCritiqueInProgress(this.critique);
    }
    this.updateAbleToSubmit();
  }

  blank (str) {
    return !str || !str.length || str.trim().length === 0;
  }

  updateAbleToSubmit () {
    let able = true;
    for (let c of this.critique) {
      if (c.required && this.blank(c.answer)) {
        able = false;
        break;
      }
    }
    this.ableToSubmit = able;
  }

  critiqueKey (): string {
    return `crt:prj:${this.project.project_id}:prt:${this.part.part_id}:ver:${this.version.version_id}`;
  }

  saveCritiqueInProgress (critique) {
    this.storeService.local.set(this.critiqueKey(), JSON.stringify(critique));
  }

  cancelCritique () {
    this.cancelled.next();
  }

  submitCritique () {
    console.log('submitCritique');
  }

  deleteCritique () {
    let del = window.confirm('Are you sure you want to delete this critique?');
    if (del) {
      this.storeService.local.remove(this.critiqueKey());
      this.cancelled.next();
    }
  }

}
