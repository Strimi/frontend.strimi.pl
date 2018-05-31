import { Component, OnInit, Renderer2 } from '@angular/core';

import { LocalStorageSrvice } from '../../../services/local-storage.service';
import { Constants } from '../../../settings/settings';


const THEME_DARK = Constants.THEME_DARK;

@Component({
  selector: 'app-change-theme',
  templateUrl: './change-theme.component.html'
})
export class ChangeThemeComponent implements OnInit {

  lightButton = true;
  darkButton = false;

  constructor(private renderer: Renderer2, private storageService: LocalStorageSrvice) { }

  ngOnInit() {
    this.getTheme();
  }

  removeDarkTheme() {
    this.renderer.removeClass(document.body, THEME_DARK);
    // this.renderer.setAttribute(document.querySelector('meta[name=theme-color]'), 'theme-color', '#3a3e64');
    this.saveTheme(null);
  }

  setDarkTheme() {
    this.renderer.addClass(document.body, THEME_DARK);
    // this.renderer.setAttribute(document.querySelector('meta[name=theme-color]'), 'theme-color', '#171F1F');
    this.saveTheme(THEME_DARK);
  }

  private getTheme() {
    const theme = this.storageService.getThemeStorage();
    if (theme) {
      this.setDarkTheme();
    }
  }

  private saveTheme(theme: string) {
    this.storageService.saveTheme(theme);
    this.buttonStatus(theme);
  }

  private buttonStatus(theme: string) {
    this.darkButton = theme === THEME_DARK;
    this.lightButton = !this.darkButton;
  }
}
