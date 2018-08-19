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
      for (let q = 0; q < this.part.questions.length; q += 1) {
        this.critique.push(this.critiqueItem(this.part.questions[q], null));
      }
      this.critique.push(this.critiqueItem('General Feedback', null));
    }
  }

  critiqueItem (question, answer) {
    return {
      question,
      answer
    };
  }

  textChanged (idx, answer) {
    if (answer.word_count <= this.maxQuestionLength) {
      this.critique[idx].answer = answer.text;
      this.saveCritiqueInProgress(this.critique);
    }
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

}
