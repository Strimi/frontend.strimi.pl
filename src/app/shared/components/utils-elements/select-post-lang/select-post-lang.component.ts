import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../../services/application.service';
import { Constants } from '../../../index';


/**
 * Component to select language for post stream.
 * It save and read inforamtion from localstorage.
 */
@Component({
  selector: 'app-select-post-lang',
  templateUrl: './select-post-lang.component.html'
})
export class SelectPostLangComponent implements OnInit {

  enButton = false;
  plButton = false;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit() {
    this.readStreamLang();
  }

  selectPostEN() {
    this.saveTagLang(Constants.STRIMI_TAG);
  }

  selectPostPL() {
    this.saveTagLang(Constants.STRIMI_TAG_PL);
  }

  private saveTagLang(strimiTag: string) {
    localStorage.setItem(Constants.STORAGE_KEY_POST_LANG, strimiTag);
    this.applicationService.setPostLang(strimiTag);
    this.buttonStatus(strimiTag);
  }

  private readStreamLang() {
    const lang = localStorage.getItem(Constants.STORAGE_KEY_POST_LANG);
    this.buttonStatus(lang);
  }

  private buttonStatus(langTag: string) {
    this.plButton = langTag === Constants.STRIMI_TAG_PL;
    this.enButton = langTag === Constants.STRIMI_TAG;
  }
}
