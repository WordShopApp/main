import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AccountService } from '../../services/account/account.service';
import { LoggerService } from '../../services/logger/logger.service';

@Component({
  selector: 'app-username-validator',
  templateUrl: './username-validator.component.html',
  styleUrls: ['./username-validator.component.scss']
})
export class UsernameValidatorComponent implements OnInit {

  @Input() oldName: string;
  @Input() newName: string;

  @Output() results: EventEmitter<any> = new EventEmitter<any>();

  valid: boolean;

  constructor (
    private accountService: AccountService,
    private loggerService: LoggerService
  ) { }

  ngOnInit() {
    this.valid = null;
  }

  validateUsername (name: string) {
    if (name && name.length > 3) {
      this.accountService.validateUsername(name).then(res => {
        this.valid = res.valid;
        this.results.emit({ 
          username: name,
          valid: res.valid,
          message: res.message 
        });
      }).catch(err => {
        this.loggerService.error(err);
      });
    }
  }

}
