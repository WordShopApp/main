import { Injectable } from '@angular/core';
import { WordIconPalette } from '../../components/word-icon/word-icon.component';

@Injectable({
  providedIn: 'root'
})
export class WordIconService {

  variations = ['hard', 'soft', 'default', 'pastel', 'light', 'pale'];

  constructor() { }

  getPalette (hash: string): WordIconPalette {
    let scheme = new window['ColorScheme'];
    let hue = this.getHue(hash);
    let variation = this.getVariation(hash);
    scheme.from_hue(hue).scheme('tetrade').variation(variation);
    let colors = scheme.colors();
    let shuffled = this.shuffleColors(hash, colors);
    return {
      primary: `#${shuffled[0]}`,
      secondary: `#${shuffled[1]}`,
      tertiary: `#${shuffled[2]}`,
      quaternary: `#${shuffled[3]}`,
      quinary: `#${shuffled[4]}`
    };
  }

  private shuffleColors (hash, colors) {
    let shuffled = [];
    for (let c = 0; c < 5; c += 1) {
      let length = hash.length;
      let first = hash.charCodeAt(0);
      let last = hash.charCodeAt(hash.length - 1);
      let total = length * (first * last);
      let counter = 0;
      let counterMax = colors.length - 1;
      for (let i = 0; i < total; i += 1) {
        counter += 1;
        if (counter > counterMax) counter = 0;
      }
      shuffled = shuffled.concat(colors.splice(counter, 1));
    }
    return shuffled;
  }

  private getHue (hash: string): number {
    let length = hash.length;
    let first = hash.charCodeAt(0);
    let last = hash.charCodeAt(hash.length - 1);
    let total = length * (first * last);
    let counter = 0;
    let counterMax = 359;
    for (let i = 0; i < total; i += 1) {
      counter += 1;
      if (counter > counterMax) counter = 0;
    }
    return counter;
  }

  private getVariation (hash: string): string {
    let length = hash.length;
    let first = hash.charCodeAt(0);
    let last = hash.charCodeAt(hash.length - 1);
    let total = length * (first * last);
    let counter = 0;
    let counterMax = 5;
    for (let i = 0; i < total; i += 1) {
      counter += 1;
      if (counter > counterMax) counter = 0;
    }
    return this.variations[counter];
  }

  private shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private getRandomHue (): number {
    return this.getRandomInt(0, 360);
  }

  private getRandomVariation (): string {
    let randIdx = Math.floor(Math.random() * this.variations.length);
    return this.variations[randIdx];
  }

  private getRandomInt (min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
