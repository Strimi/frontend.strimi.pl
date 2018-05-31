import { Component, OnInit, Input } from '@angular/core';
import { AccountCreateWithDelegation } from '../../../index';

@Component({
  selector: 'app-account-create-with-delegation',
  templateUrl: './account-create-with-delegation.component.html',
  styles: []
})
export class AccountCreateWithDelegationComponent implements OnInit {

  @Input()
  accountCreate: AccountCreateWithDelegation;
  @Input()
  timestamp: Date;

  constructor() { }

  ngOnInit() {
  }

}
