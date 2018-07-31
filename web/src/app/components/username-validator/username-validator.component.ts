import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-username-validator',
  templateUrl: './username-validator.component.html',
  styleUrls: ['./username-validator.component.scss']
})
export class UsernameValidatorComponent implements OnInit {

  @Input() oldName: string;
  @Input() newName: string;

  valid: boolean;

  constructor() { }

  ngOnInit() {
    this.valid = null;
  }

}
