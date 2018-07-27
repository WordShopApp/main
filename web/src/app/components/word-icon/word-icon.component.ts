import { Component, Input, OnInit } from '@angular/core';

export const WordIconTypes = {
  Project:  'project',
  Critique: 'critique'
};

export class WordIconPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  quinary: string;
}

@Component({
  selector: 'app-word-icon',
  templateUrl: './word-icon.component.html',
  styleUrls: ['./word-icon.component.scss']
})
export class WordIconComponent implements OnInit {

  @Input() type: string;
  @Input() palette: WordIconPalette;

  constructor () { }

  ngOnInit () {
    console.log('palette', this.palette);
  }

}
