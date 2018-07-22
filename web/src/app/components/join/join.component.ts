import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  @ViewChild('emailInput') emailInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  createAccount (evt) {
    evt.preventDefault();
    let email = this.emailInput.nativeElement.value;
    let password = this.passwordInput.nativeElement.value;
    console.log(email, password);
  }

}
