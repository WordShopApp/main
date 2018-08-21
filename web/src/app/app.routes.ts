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
import { ProjectWizardComponent } from './components/project-wizard/project-wizard.component';
import { ProjectIndexComponent } from './components/project-index/project-index.component';
import { ProjectComponent } from './components/project/project.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { ProjectConfigComponent } from './components/project-config/project-config.component';
import { CropTesterComponent } from './components/crop-tester/crop-tester.component';
import { ProfileComponent } from './components/profile/profile.component';

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
    path: 'crop-tester', component: CropTesterComponent
  },
  {
    path: '',
    component: RootComponent,
    resolve: { data: RootResolver },
    canActivate: [AuthService],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'projects', component: ProjectIndexComponent },
      { path: 'projects/new', component: ProjectWizardComponent },
      { path: 'projects/:id', component: ProjectComponent },
      { path: 'projects/:id/config/:area', component: ProjectConfigComponent },
      { path: 'settings/:area', component: UserSettingsComponent },
      { path: ':username', component: ProfileComponent }
    ]
  }

];
