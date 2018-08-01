import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AccountService } from '../../services/account/account.service';
import { LoggerService } from '../../services/logger/logger.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-username-validator',
  templateUrl: './username-validator.component.html',
  styleUrls: ['./username-validator.component.scss']
})
export class UsernameValidatorComponent implements OnInit {

  @Input() oldName: string;
  @Input() newName: string;

  @Output() results: EventEmitter<any> = new EventEmitter<any>();

  inputChanged: Subject<string> = new Subject<string>();

  msg: string;
  valid: boolean;
  validating: boolean;

  constructor (
    private accountService: AccountService,
    private loggerService: LoggerService
  ) { }

  ngOnInit() {
    this.inputChanged.pipe(debounceTime(500)).subscribe(this.runValidation.bind(this));
    this.valid = null;
  }

  validateUsername (name: string) {
    this.results.emit({ 
      username: name,
      valid: null,
      message: null
    });
    if (name && name.length > 3) {
      this.inputChanged.next(name);
    } else {
      this.valid = null;
    }
  }

  runValidation (name) {
    if (name === this.oldName) return this.valid = null;

    this.msg = null;
    this.valid = null;
    this.accountService.validateUsername(name).then(res => {
      this.valid = res.valid;
      this.msg = res.message;
      this.results.emit({ 
        username: name,
        valid: res.valid,
        message: res.message 
      });
    }).catch(err => {
      this.valid = null;
      this.loggerService.error(err);
    });

  }

}
