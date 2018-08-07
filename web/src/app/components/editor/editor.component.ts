import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  wordCount: number;
  justPasted: boolean;

  @Input() text: string;
  @Input() showWordCount: boolean;
  @Input() maxWordCount: number;

  @Output() textChanged = new EventEmitter<any>();

  onTrixChangeEvent: any;
  onTrixPasteEvent: any;

  constructor () { }

  ngOnInit() {
    this.initText();
    this.setupSubscriptions();
  }

  ngOnDestroy () {
    this.teardownSubscriptions();
  }

  clearInput () {
    let trix = document.querySelector('trix-editor');
    if (trix && trix['editor']) {
      trix['editor'].loadHTML('');
    }
  }

  onTrixChange (evt) {
    let res = { text: null };
    res.text = evt.target.value;
    if (this.showWordCount) {
      let ed = this.trixEditor();
      if (this.justPasted) {
        this.justPasted = false;
        this.text = evt.target.value;
        this.clearInput();
        this.initText();
      } else {
        let plaintext = ed.getDocument().toString();
        this.wordCount = this.countWords(plaintext); 
      }
      res['word_count'] = this.wordCount;
    }
    this.textChanged.emit(res);
  }

  onTrixPaste (evt) {
    this.justPasted = true;
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
      this.onTrixPasteEvent = this.onTrixPaste.bind(this);
      trix.addEventListener('trix-paste', this.onTrixPasteEvent);
    }
  }

  private teardownSubscriptions () {
    let trix = document.querySelector('trix-editor');
    if (trix) {
      trix.removeEventListener('trix-change', this.onTrixChangeEvent);
      trix.removeEventListener('trix-paste', this.onTrixPasteEvent);
    }
  }

}
