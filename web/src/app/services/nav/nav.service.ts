import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class NavService {

  constructor (private router: Router) { }

  gotoWelcome () {
    this.gotoPath('/welcome');
  }

  gotoPath (path: string) {
    this.router.navigate([path]);
  }
}
