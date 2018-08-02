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
  @Output() validationResults: EventEmitter<any> = new EventEmitter<any>();

  inputChanged: Subject<string> = new Subject<string>();

  username: string;
  message: string;
  valid: boolean;

  constructor (
    private accountService: AccountService,
    private loggerService: LoggerService
  ) { }

  ngOnInit() {
    this.inputChanged.pipe(debounceTime(1000)).subscribe(this.runValidation.bind(this));
    this.valid = null;
  }

  validateUsername (name: string) {
    this.usernameChanged.emit(name);
    this.valid = null;
    if (name && name.length > 4) {
      this.inputChanged.next(name);
    } else {
      this.valid = null;
    }
  }

  low (str) {
    return str && str.toLowerCase();
  }

  emitResults () {
    this.validationResults.emit({
      username: this.username,
      valid: this.valid,
      message: this.message
    });
  }

  saveResults (username, valid, message) {
    this.username = username;
    this.valid = valid;
    this.message = message;
  }

  runValidation (name) {

    this.saveResults(name, null, null);
    this.emitResults();

    if (this.low(name) === this.low(this.profile.username)) return;

    this.accountService.validateUsername(name).then(res => {
      this.valid = res.valid;
      this.message = res.message;
    }).catch(err => {
      this.loggerService.error(err);
    });

  }

}
