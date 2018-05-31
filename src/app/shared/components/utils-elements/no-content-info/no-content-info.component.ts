import { Component, OnInit, Input } from '@angular/core';


/**
 * Simple element to show no content info if
 * there is no more data to fetch
 */
@Component({
  selector: 'app-no-content-info',
  templateUrl: './no-content-info.component.html',
  styles: []
})
export class NoContentInfoComponent implements OnInit {

  @Input()
  message: string;

  constructor() { }

  ngOnInit() {
  }

}
