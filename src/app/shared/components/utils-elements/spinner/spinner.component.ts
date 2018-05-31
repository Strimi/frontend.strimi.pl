import { Component, OnInit, Input } from '@angular/core';

/**
 * Used to show durign waiting for resposne from api
 */
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styles: []
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
