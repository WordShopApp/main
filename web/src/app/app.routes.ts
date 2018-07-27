import { Routes } from '@angular/router';

import { RootComponent } from './components/root/root.component';
import { RootResolver } from './components/root/root.resolver';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { JoinComponent } from './components/join/join.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { CookiesComponent } from './components/cookies/cookies.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { AboutComponent } from './components/about/about.component';
import { IconTesterComponent } from './components/icon-tester/icon-tester.component';

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
    path: 'terms', component: TermsComponent
  },
  {
    path: 'privacy', component: PrivacyComponent
  },
  {
    path: 'cookies', component: CookiesComponent
  },
  {
    path: 'about', component: AboutComponent
  },
  {
    path: 'confirmation', component: ConfirmationComponent
  },
  {
    path: 'icon-tester', component: IconTesterComponent
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
