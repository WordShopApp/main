import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutes } from './app.routes';
import { AppComponent } from './app.component';

// Services
import { AccountService } from './services/account/account.service';
import { ApiService } from './services/api/api.service';
import { AuthService } from './services/auth/auth.service';
import { CognitoService } from './services/cognito/cognito.service';
import { GravatarService } from './services/gravatar/gravatar.service';
import { LoggerService } from './services/logger/logger.service';
import { MessengerService } from './services/messenger/messenger.service';
import { NavService } from './services/nav/nav.service';
import { SettingsService } from './services/settings/settings.service';
import { StoreService } from './services/store/store.service';
import { StoreReducer } from './services/store/store.reducer';

// Components
import { AlertComponent } from './components/alert/alert.component';
import { RootComponent } from './components/root/root.component';
import { RootResolver } from './components/root/root.resolver';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { InfoComponent } from './components/info/info.component';
import { LoginComponent } from './components/login/login.component';
import { JoinComponent } from './components/join/join.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { CookiesComponent } from './components/cookies/cookies.component';

import { CookieService } from 'ng2-cookies';

@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    LoginComponent,
    JoinComponent,
    RootComponent,
    DashboardComponent,
    WelcomeComponent,
    AlertComponent,
    ForgotPasswordComponent,
    TermsComponent,
    PrivacyComponent,
    CookiesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes, { useHash: false })
  ],
  exports: [RouterModule],
  providers: [
    AccountService,
    ApiService,
    AuthService,
    CognitoService,
    CookieService,
    GravatarService,
    LoggerService,
    MessengerService,
    NavService,
    RootResolver,
    SettingsService,
    StoreReducer,
    StoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
