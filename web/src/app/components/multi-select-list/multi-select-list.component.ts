import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-multi-select-list',
  templateUrl: './multi-select-list.component.html',
  styleUrls: ['./multi-select-list.component.scss']
})
export class MultiSelectListComponent implements OnInit, OnChanges {

  selected = [];
  unselected = [];

  filtered = [];
  hasFilteredMatches: boolean = null;

  @Input() list: any;
  @Input() max: number;
  @Input() mode: string;
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
        if (this.mode === 'custom') {
          let lvalues = list.map(l => l.value);
          for (let i = 0; i < selected.length; i += 1) {
            let sitem = selected[i];
            if (lvalues.indexOf(sitem) === -1) {
              this.selected.push({
                name: sitem,
                value: sitem,
                custom: true
              });
            }
          }
          this.selected.sort(this.nameSorter);
        }
        this.filtered = [];
        this.changed.emit(this.selected);
      } else {
        this.unselected = this.clone(list);
        this.selected = [];
        this.filtered = [];
        this.changed.emit(this.selected);
      }
    }, 0);
  }

  private removeItem (array, item) {
    let index = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
  }

  private addAllowed (): boolean {
    return (!this.max || (this.max && this.max > this.selected.length)) ? true : false;
  }

  private addToSelected (value) {
    if (this.addAllowed()) {
      this.selected.push(value);
      this.removeItem(this.unselected, value);
      this.sortLists();
      this.changed.emit(this.selected);
    }
  }

  private removeFromSelected (value) {
    if (!value.custom) this.unselected.push(value);
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

  private filterList (term) {
    if (term) {
      this.filtered = this.unselected
        .filter(u => u.value.indexOf(term.toLowerCase()) === 0)
        .map(f => f.value);
      this.hasFilteredMatches = this.filtered.length ? true : false;
    } else {
      this.filtered = [];
      this.hasFilteredMatches = null;
    }
  }

  private addCustomItem (customItemInput: HTMLInputElement) {
    let customItem = customItemInput.value;
    if (customItem && (this.selected.length < this.max)) {
      this.selected.push({
        name: customItem,
        value: customItem,
        custom: true
      });
      this.selected.sort(this.nameSorter);
      customItemInput.value = null;
      this.changed.emit(this.selected);
    }
  }

}
