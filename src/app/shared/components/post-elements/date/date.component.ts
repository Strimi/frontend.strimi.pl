import { Component, Input } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { Constants } from '../../../settings/settings';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html'
})
export class DateComponent {

  formattedDate: string;
  formattedTipDate: string;
  private orgDate: string;

  @Input()
  simpleDate: boolean;
  @Input()
  classDate: string;

  @Input()
  set date(date: string) {
    this.orgDate = date;
    this.formattedTipDate = this.formatTipDate(date, this.translate.currentLang);
    this.formattedDate = this.formatDate(date, this.translate.currentLang);
  }

  constructor(private translate: TranslateService) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.formattedDate = this.formatDate(this.orgDate, event.lang);
      this.formattedTipDate = this.formatTipDate(this.orgDate, this.translate.currentLang);
    });
  }

  private formatDate(date: string, lang: string) {
    return moment.utc(date).local().locale(lang).fromNow();
  }

  private formatTipDate(date: string, lang: string) {
    const format = lang !== Constants.PL_LANG ? 'YYYY/MM/DD hh:mm A' : 'YYYY/MM/DD HH:mm';
    return moment.utc(date).local().format(format);
  }

}
