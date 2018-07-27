import { Component, Input, OnChanges, OnInit } from '@angular/core';

export const AlertTypes = {
  Info:     'info',
  Warning:  'warning',
  Danger:   'danger',
  Success:  'success'
};

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnChanges {

  @Input() type: string;
  @Input() show: boolean;
  @Input() timeout: number;
  @Input() header: string;
  @Input() message: string;

  defaultType = AlertTypes.Info;
  showAlert = false;
  showAlertTimer: any;

  constructor () { }

  ngOnChanges (changes) {
    let show = changes['show'];
    if (this.shouldUpdateShow(show)) {
      if (show.currentValue === true) {
        this.doShow(this.timeout);
      } else {
        this.showAlert = false;
      }
    }
  }

  ngOnInit () {
    if (this.show && this.message) this.doShow(this.timeout);
  }

  hide () {
    this.showAlert = false;
  }

  private shouldUpdateShow (showChange): boolean {
    return (showChange.currentValue === true || showChange.currentValue === false) && 
           (showChange.currentValue !== showChange.previousValue);
  }

  private doShow (timeout) {
    this.showAlert = true;
    if (timeout) setTimeout(() => this.showAlert = false, timeout);
  }

}
