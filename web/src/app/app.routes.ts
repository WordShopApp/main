import { Routes } from '@angular/router';

import { RootComponent } from './components/root/root.component';
import { RootResolver } from './components/root/root.resolver';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { JoinComponent } from './components/join/join.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

import { AuthService } from './services/auth/auth.service';

export const AppRoutes: Routes  = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: JoinComponent
  },
  {
    path: 'forgot-password', component: ForgotPasswordComponent
  },
  {
    path: 'welcome', component: WelcomeComponent
  },
  {
    path: '',
    component: RootComponent,
    resolve: { data: RootResolver },
    canActivate: [AuthService],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent }
    ]
  }

];
