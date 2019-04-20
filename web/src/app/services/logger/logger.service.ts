import { Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class LoggerService {

  _debug: boolean;

  // Instead of requiring constants in the settings.js, just know that:
  //  Level 0: Nothing is logged (Default for production, tkmDebug == false)
  //  Level 1: Errors
  //  Level 2: Warnings or Errors
  //  Level 3: Log, Warnings, or Errors
  //  Level 4: Info, Log, Warnings, Errors (Default for tkmDebug == true)
  _level: number;

  constructor (private _settingsService: SettingsService) { 
    this._level = 4;
    this._debug = true;
    if (!this._debug) this._level = 0;
  }

  noop = () => {};

  get log () {
    if (this._level > 2) {
      return console.log.bind(console);
    } else {
      return this.noop;
    }
  }

  get warn () {
    if (this._level > 1) {
      return console.warn.bind(console);
    } else {
      return this.noop;
    }
  }

  get error () {
    if (this._level > 0) {
      return console.error.bind(console);
    } else {
      return this.noop;
    }
  }
}
