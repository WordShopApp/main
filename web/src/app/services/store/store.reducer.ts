import { Injectable } from '@angular/core';
import { fromJS } from 'immutable';
import { StoreActions as Actions } from './store.actions';
import { StoreProps as Props } from './store.props';

@Injectable ()
export class StoreReducer {

  private reducers = {

    [Actions.Init.Profile]: (store, newProfile) => {
      let prop = Props.App.Profile;
      return this.results(prop, fromJS(newProfile));
    },
    [Actions.UI.UpdateShowHomeIcon]: (store, newState) => {
      let prop = Props.UI.ShowHomeIcon;
      return this.results(prop, fromJS(newState));
    }
    
  };

  constructor () {}

  apply (action: string, store, newData): any {
    return this.reducers[action](store, newData);
  }

  private value (store, prop) {
    return store[prop].data.getValue();
  }

  private results (prop, state) {
    return { prop: prop, state: state };
  }
}
