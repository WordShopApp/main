import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AccountService } from '../../services/account/account.service';
import { LoggerService } from '../../services/logger/logger.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-username-selector',
  templateUrl: './username-selector.component.html',
  styleUrls: ['./username-selector.component.scss']
})
export class UsernameSelectorComponent implements OnInit {

  @Input() profile: any;

  @Output() usernameChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() editModeChanged: EventEmitter<any> = new EventEmitter<any>();

  inputChanged: Subject<string> = new Subject<string>();

  message: string;
  valid: boolean;
  validating: boolean;

  constructor (
    private accountService: AccountService,
    private loggerService: LoggerService
  ) { }

  ngOnInit() {
    this.inputChanged.pipe(debounceTime(750)).subscribe(this.runValidation.bind(this));
    this.valid = null;
  }

  validateUsername (name: string) {
    if (name && name.length > 3) {
      this.inputChanged.next(name);
    } else {
      this.valid = null;
    }
  }

  runValidation (name) {
    if (name === this.profile.username) return this.valid = null;

    this.message = null;
    this.valid = null;
    this.accountService.validateUsername(name).then(res => {
      this.valid = res.valid;
      this.message = res.message;
    }).catch(err => {
      this.valid = null;
      this.loggerService.error(err);
    });

  }

}
