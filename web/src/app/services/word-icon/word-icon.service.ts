import { Injectable } from '@angular/core';
import { WordIconPalette } from '../../components/word-icon/word-icon.component';

@Injectable({
  providedIn: 'root'
})
export class WordIconService {

  variations = ['hard', 'soft', 'default', 'pastel', 'light', 'pale'];
  scheme = 'tetrade';
  paletteCount = 5;

  grayPalette = {
    primary: '#5F5F5E',
    secondary: '#3A3A39',
    tertiary: '#B4B6B6',
    quaternary: '#FEFEFE',
    quinary: '#4C4C4C'
  };

  constructor() { }

  getPalette (hash: string): WordIconPalette {
    if (!hash) return this.grayPalette;

    let hue = this.getHue(hash);
    let variation = this.getVariation(hash);

    let scheme = new window['ColorScheme'];
    scheme.from_hue(hue).scheme(this.scheme).variation(variation);
    let colors = scheme.colors();

    let shuffled = this.shuffleColors(hash, colors, this.paletteCount);

    return {
      primary: `#${shuffled[0]}`,
      secondary: `#${shuffled[1]}`,
      tertiary: `#${shuffled[2]}`,
      quaternary: `#${shuffled[3]}`,
      quinary: `#${shuffled[4]}`
    };
  }

  private shuffleColors (hash, colors, howMany) {
    let shuffled = [];
    for (let c = 0; c < howMany; c += 1) {
      let cidx = this.getNumberStamp(hash, colors.length - 1);
      shuffled = shuffled.concat(colors.splice(cidx, 1));
    }
    return shuffled;
  }

  private getHue (hash: string): number {
    return this.getNumberStamp(hash, 359);
  }

  private getVariation (hash: string): string {
    let vidx = this.getNumberStamp(hash, this.variations.length - 1);
    return this.variations[vidx];
  }

  private getNumberStamp (hash: string, max: number): number {
    let total = this.getHashTotalCount(hash);
    let counter = 0;
    for (let i = 0; i < total; i += 1) {
      counter += 1;
      if (counter > max) counter = 0;
    }
    return counter;
  }

  private getHashTotalCount (hash): number {
    let length = hash.length;
    let first = hash.charCodeAt(0);
    let last = hash.charCodeAt(hash.length - 1);
    return length * (first * last);
  }

}
