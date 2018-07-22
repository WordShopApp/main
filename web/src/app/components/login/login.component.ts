import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  login (evt) {
    evt.preventDefault();
    let email = this.emailInput.nativeElement.value;
    let password = this.passwordInput.nativeElement.value;
    console.log(email, password);
  }

}
