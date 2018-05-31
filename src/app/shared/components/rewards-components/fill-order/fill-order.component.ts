import { Component, OnInit, Input } from '@angular/core';
import { FillOrder } from '../../../index';

@Component({
  selector: 'app-fill-order',
  templateUrl: './fill-order.component.html',
  styles: []
})
export class FillOrderComponent implements OnInit {

  @Input()
  fillOrder: FillOrder;
  @Input()
  timestamp: Date;

  constructor() { }

  ngOnInit() {
  }

}
