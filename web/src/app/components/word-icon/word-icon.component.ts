import { Component, Input, OnInit } from '@angular/core';

export const WordIconTypes = {
  Project:  'project',
  Critique: 'critique',
  Profile:  'profile'
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

  grayscalePalette: {
    primary: '#5F5F5E',
    secondary: '#3A3A39',
    tertiary: '#B4B6B6',
    quaternary: '#FEFEFE',
    quinary: '#4C4C4C'
  };

  @Input() type: string;
  @Input() palette: WordIconPalette;
  @Input() showGrayscale: boolean;

  constructor () { }

  ngOnInit () {
    if (this.showGrayscale) this.palette = this.grayscalePalette;
  }

}
