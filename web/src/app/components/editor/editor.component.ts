import { Component, ElementRef, EventEmitter, Input, Output, OnInit, OnDestroy, ViewChild } from '@angular/core';

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

  @ViewChild('trix') trix: ElementRef;

  @Output() textChanged = new EventEmitter<any>();

  onTrixChangeEvent: any;
  onTrixPasteEvent: any;
  onTrixKeydownEvent: any;

  constructor () { }

  ngOnInit() {
    this.initText();
    this.setupSubscriptions();
  }

  ngOnDestroy () {
    this.teardownSubscriptions();
  }

  clearInput () {
    let ed = this.trixEditor();
    if (ed) ed.loadHTML('');
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

  onTrixKeydown (evt) {
    switch (evt.key) {
      case 'Tab':
        evt.preventDefault();
        this.trixEditor().insertString('  ');
        break;
      default:
        break;
    }
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
    return (this.trix && this.trix.nativeElement && this.trix.nativeElement['editor']) || null;
  }

  private trixElement () {
    return (this.trix && this.trix.nativeElement) || null;
  }

  private countWords (str) {
    if (str && str.length === 1) return 0;

    // modified from https://stackoverflow.com/a/40385425
    return (str && str.split(' ').filter(w => w !== '').length) || null;
  }

  private setupSubscriptions () {
    let trix = this.trixElement();
    if (trix) {
      this.onTrixChangeEvent = this.onTrixChange.bind(this);
      trix.addEventListener('trix-change', this.onTrixChangeEvent);
      this.onTrixPasteEvent = this.onTrixPaste.bind(this);
      trix.addEventListener('trix-paste', this.onTrixPasteEvent);
      this.onTrixKeydownEvent = this.onTrixKeydown.bind(this);
      trix.addEventListener('keydown', this.onTrixKeydownEvent);
    }
  }

  private teardownSubscriptions () {
    let trix = this.trixElement();
    if (trix) {
      trix.removeEventListener('trix-change', this.onTrixChangeEvent);
      trix.removeEventListener('trix-paste', this.onTrixPasteEvent);
      trix.removeEventListener('keydown', this.onTrixKeydownEvent);
    }
  }

}
