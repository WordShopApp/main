import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { LoggerService } from '../../services/logger/logger.service';
import { ViewService } from '../../services/view/view.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  param$: Subscription;
  username: any;

  user: any;
  projects: any;
  critiques: any;

  constructor(
    private route: ActivatedRoute,
    private loggerService: LoggerService,
    private viewService: ViewService
  ) { }

  ngOnInit() {
    this.param$ = this.route.paramMap.subscribe(params => {
      this.username = params.get('username').slice(1);
      this.viewService.profile(this.username).then(data => {
        this.user = data.user;
        this.projects = data.projects;
        this.critiques = data.critiques;
      }).catch(err => {
        this.loggerService.error(err);
      });
    });
  }

}
