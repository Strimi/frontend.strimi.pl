import { Component, OnInit, Input } from '@angular/core';

/**
 * Simple component to show errors if happend
 */
@Component({
  selector: 'app-error-info',
  templateUrl: './error-info.component.html',
  styles: []
})
export class ErrorInfoComponent implements OnInit {

  @Input()
  message: string;

  constructor() { }

  ngOnInit() {
  }

}
