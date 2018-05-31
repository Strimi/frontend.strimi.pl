import { ChangeDetectorRef, Component } from '@angular/core';

import { ExchangePrice } from '../../..';
import { UserStrimiService } from '../../../services/user-strimi.service';


/**
 * Shows information about prices coins
 */
@Component({
  selector: 'app-sidebar-exchange',
  templateUrl: './exchange.component.html',
})
export class ExchangeComponent {

  rates = new Array<ExchangePrice>();

  constructor(public userStrimiService: UserStrimiService, private cdr: ChangeDetectorRef) {
    this.userStrimiService.currencyRates.asObservable().subscribe(data => {
      this.rates = data;
    });
  }

}
