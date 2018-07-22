import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { propList } from './store.props';
import { StoreReducer } from './store.reducer';
import { LoggerService } from '../logger/logger.service';

@Injectable ()
export class StoreService {
  private _store;

  local = {
    get: (key: string): string => {
      return window.localStorage.getItem(key);
    },
    set: (key: string, value: any): void => {
      window.localStorage.setItem(key, value);
    },
    remove: (key: string): void => {
      window.localStorage.removeItem(key);
    }
  };

  session = {
    get: (key: string): string => {
      return window.sessionStorage.getItem(key);
    }
  };

  constructor (private _loggerService: LoggerService, private _reducer: StoreReducer) {}

  init (pojoStore = null) {
    this._store = {};
    let props = propList();
    for (let p of props) {
      let value = this.itemValue(pojoStore && pojoStore[p]);
      this._store[p] = this.storeItem(value);
    }
  }

  get (propKey: string): any {
    let val = this._store[propKey].data.getValue();
    return val ? val.toJS() : null;
  }

  set (propKey: string, value: any): void {
    this._store[propKey].data.next(value);
  }

  subscribe (propKey: string, callback): Subscription {
    return this._store[propKey].observable.subscribe(callback);
  }

  dispatch (action: string, newData) {
    this._loggerService.info('StoreService.dispatch', action, newData);
    let results = this._reducer.apply(action, this._store, newData);
    this.set(results.prop, results.state);
  }

  snapshot (toJSON = false): (string | Object) {
    let ss = {};
    for (let s in this._store) {
      if (this._store.hasOwnProperty(s)) {
        ss[s] = this._store[s].data.getValue();
      }
    }
    return toJSON ? JSON.stringify(ss) : ss;
  }

  private hasValue (value) {
    return value && (value === 0 || value === false || value);
  }

  private itemValue (value) {
    return (this.hasValue(value) && value) || null;
  }

  private storeItem (itemValue) {
    let item = new BehaviorSubject<any>(itemValue);
    return { data: item, observable: item.asObservable() };
  }
}
