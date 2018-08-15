import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-word-image',
  templateUrl: './word-image.component.html',
  styleUrls: ['./word-image.component.scss']
})
export class WordImageComponent implements OnInit, OnChanges {

  @Input() url: string;
  @Input() size: number;

  imageUrl: string;

  constructor() { }

  ngOnInit() {
    this.initImageUrl();
  }

  initImageUrl () {
    if (this.url && this.size) 
      this.imageUrl = this.url.replace('{{size}}', this.size.toString());
  }

  ngOnChanges (changes: SimpleChanges) {
    this.initImageUrl();
  }

}
