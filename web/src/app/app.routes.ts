import { Routes } from '@angular/router';

import { RootComponent } from './components/root/root.component';
import { RootResolver } from './components/root/root.resolver';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InfoComponent } from './components/info/info.component';
import { LoginComponent } from './components/login/login.component';
import { JoinComponent } from './components/join/join.component';

import { AuthService } from './services/auth/auth.service';

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
    component: RootComponent,
    resolve: { data: RootResolver },
    canActivate: [AuthService],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
    ]
  }

];
