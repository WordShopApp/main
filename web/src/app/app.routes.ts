import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { InfoComponent } from './components/info/info.component';
import { LoginComponent } from './components/login/login.component';
import { JoinComponent } from './components/join/join.component';

export const AppRoutes: Routes  = [
  {
    path: 'info', component: InfoComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'join', component: JoinComponent
  },
  {
    path: '',
    component: HomeComponent
  }
];
