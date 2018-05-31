import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from '../../../settings/settings';
/**
 * Component to select application language.
 * Language is stored in localStorage.
 */
@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html'
})
export class SelectLanguageComponent implements OnInit {

  enButton = false;
  plButton = false;
  koButton = false;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.getLang();
  }

  selectLanguageEN() {
    this.saveLang(Constants.EN_LANG);
  }

  selectLanguagePL() {
    this.saveLang(Constants.PL_LANG);
  }

  selectLanguageKO() {
    this.saveLang(Constants.KO_LANG);
  }

  private saveLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem(Constants.STORAGE_KEY_LANG, lang);
    this.buttonStatus(lang);
  }

  private getLang() {
    const lang = localStorage.getItem(Constants.STORAGE_KEY_LANG);
    this.buttonStatus(lang);
  }

  private buttonStatus(lang: string) {
    this.plButton = lang === Constants.PL_LANG;
    this.enButton = lang === Constants.EN_LANG;
    this.koButton = lang === Constants.KO_LANG;
  }
}
