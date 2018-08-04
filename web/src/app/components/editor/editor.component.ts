import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  wordCount: number;

  @Input() text: string;
  @Input() showWordCount: boolean;
  @Input() maxWordCount: number;

  @Output() textChanged = new EventEmitter<any>();

  onTrixChangeEvent: any;

  constructor () { }

  ngOnInit() {
    this.initText();
    this.setupSubscriptions();
  }

  ngOnDestroy () {
    this.teardownSubscriptions();
  }

  onTrixChange (evt) {
    let res = { text: null };
    res.text = evt.target.value;
    if (this.showWordCount) {
      let ed = this.trixEditor();
      let plaintext = ed.getDocument().toString();
      this.wordCount = this.countWords(plaintext);
      res['word_count'] = this.wordCount;
    }
    this.textChanged.emit(res);
  }

  private initText () {
    if (this.text) {
      let ed = this.trixEditor();
      ed.setSelectedRange([0, 0]);
      ed.insertHTML(this.text);
      let plaintext = ed.getDocument().toString();
      this.wordCount = this.countWords(plaintext);
    }
  }

  private trixEditor () {
    let trix = document.querySelector('trix-editor');
    return trix['editor'];
  }

  private countWords (str) {
    if (str && str.length === 1) return 0;

    // modified from https://stackoverflow.com/a/40385425
    return (str && str.split(' ').filter(w => w !== '').length) || null;
  }

  private setupSubscriptions () {
    let trix = document.querySelector('trix-editor');
    if (trix) {
      this.onTrixChangeEvent = this.onTrixChange.bind(this);
      trix.addEventListener('trix-change', this.onTrixChangeEvent);
    }
  }

  private teardownSubscriptions () {
    let trix = document.querySelector('trix-editor');
    if (trix) {
      trix.removeEventListener('trix-change', this.onTrixChangeEvent);
    }
  }

}
