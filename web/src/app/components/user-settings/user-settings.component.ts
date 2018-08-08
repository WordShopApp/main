import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  area: string;
  param$: Subscription;

  constructor (private route: ActivatedRoute) { }

  ngOnInit() {
    this.param$ = this.route.paramMap.subscribe(params => {
      this.area = params.get('area');
    });
  }

  ngOnDestroy () {
    this.param$.unsubscribe();
  }

}
