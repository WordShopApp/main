import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class NavService {

  constructor (private router: Router) { }

  gotoWelcome () {
    this.gotoPath('/welcome');
  }

  gotoRoot () {
    this.gotoPath('/');
  }

  gotoLogin () {
    this.gotoPath('/login');
  }

  gotoConfirmation () {
    this.gotoPath('/confirmation');
  }

  gotoProject (projectId) {
    this.gotoPath(`/projects/${projectId}`);
  }

  gotoProjectConfig (projectId, area) {
    this.gotoPath(`/projects/${projectId}/config/${area}`);
  }

  gotoPath (path: string) {
    this.router.navigate([path]);
  }
}
