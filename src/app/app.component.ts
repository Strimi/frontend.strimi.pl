import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { Constants } from './shared';
import { LocalStorageSrvice } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private title: Title,
    private translate: TranslateService,
    private storageService: LocalStorageSrvice,
    private scrollToService: ScrollToService,
    private router: Router) {
    title.setTitle('Strona Główna - Strimi.pl');
    this.storageService.init();
  }

  ngOnInit(): void {
    this.setInitLangugage();
    this.setInitPostLanguage();
    this.scrollToTop();
  }

  setInitLangugage() {
    if (localStorage.getItem(Constants.STORAGE_KEY_LANG) === null) {
      localStorage.setItem(Constants.STORAGE_KEY_LANG, this.translate.getBrowserLang());
    }
    this.translate.setDefaultLang(localStorage.getItem(Constants.STORAGE_KEY_LANG));
    this.translate.use(localStorage.getItem(Constants.STORAGE_KEY_LANG));
  }

  setInitPostLanguage() {
    if (localStorage.getItem(Constants.STORAGE_KEY_POST_LANG) === null) {
      const postLang = localStorage.getItem(Constants.STORAGE_KEY_LANG) === Constants.PL_LANG
        ? Constants.STRIMI_TAG_PL : Constants.STRIMI_TAG;
      localStorage.setItem(Constants.STORAGE_KEY_POST_LANG, postLang);
    }
  }

  scrollToTop() {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        const config: ScrollToConfigOptions = {
          target: 'top'
        };
        this.scrollToService.scrollTo(config);
      }
    });
  }

}
