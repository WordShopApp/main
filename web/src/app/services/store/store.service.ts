import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { propList } from './store.props';
import { StoreReducer } from './store.reducer';
import { LoggerService } from '../logger/logger.service';

@Injectable ()
export class StoreService {
  private store;

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

  constructor (private loggerService: LoggerService, private reducer: StoreReducer) {}

  init (pojoStore = null) {
    this.store = {};
    let props = propList();
    for (let p of props) {
      let value = this.itemValue(pojoStore && pojoStore[p]);
      this.store[p] = this.storeItem(value);
    }
  }

  get (propKey: string): any {
    let val = this.store[propKey].data.getValue();
    return val ? val.toJS() : null;
  }

  set (propKey: string, value: any): void {
    this.store[propKey].data.next(value);
  }

  subscribe (propKey: string, callback): Subscription {
    return this.store[propKey].observable.subscribe(callback);
  }

  dispatch (action: string, newData) {
    this.loggerService.info('StoreService.dispatch', action, newData);
    let results = this.reducer.apply(action, this.store, newData);
    this.set(results.prop, results.state);
  }

  snapshot (toJSON = false): (string | Object) {
    let ss = {};
    for (let s in this.store) {
      if (this.store.hasOwnProperty(s)) {
        ss[s] = this.store[s].data.getValue();
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
