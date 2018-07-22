import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable()
export class RootResolver implements Resolve<any> {

  constructor () {}

  resolve () {
    return new Promise((resolve, reject) => {
      console.log('RootResolver.resolve');
      resolve();
    });
  }
}
