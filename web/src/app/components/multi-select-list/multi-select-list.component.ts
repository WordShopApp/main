import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-multi-select-list',
  templateUrl: './multi-select-list.component.html',
  styleUrls: ['./multi-select-list.component.scss']
})
export class MultiSelectListComponent implements OnInit, OnChanges {

  selected = [];
  unselected = [];

  @Input() list: any;
  @Input() preselected: any;
  @Input() orientation: string;

  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.resetLists(this.list, this.preselected);
  }

  ngOnChanges (changes: SimpleChanges) {
    if (changes.list && changes.list.currentValue) {
      this.resetLists(changes.list.currentValue, null);
    }
  }

  private clone (obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  private resetLists (list, selected) {
    setTimeout(() => {
      if (selected) {
        this.unselected = list.filter(l => selected.indexOf(l.value) === -1);
        this.selected = list.filter(l => selected.indexOf(l.value) >= 0);
        this.changed.emit(this.selected);
      } else {
        this.unselected = this.clone(list);
        this.selected = [];
        this.changed.emit(this.selected);
      }
    }, 0);
  }

  private removeItem (array, item) {
    let index = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
  }

  private addToSelected (value) {
    this.selected.push(value);
    this.removeItem(this.unselected, value);
    this.sortLists();
    this.changed.emit(this.selected);
  }

  private removeFromSelected (value) {
    this.unselected.push(value);
    this.removeItem(this.selected, value);
    this.sortLists();
    this.changed.emit(this.selected);
  }

  private sortLists () {
    this.unselected.sort(this.nameSorter);
    this.selected.sort(this.nameSorter);
  }

  private nameSorter (a, b) {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

}
