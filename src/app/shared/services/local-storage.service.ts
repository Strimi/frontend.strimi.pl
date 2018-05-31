import {Injectable} from '@angular/core';
import {StrimiStorage} from '../models/strimi-storage.models';
import {Constants} from '../settings/settings';
import {environment} from '../../../environments/environment';
import {UserLogin} from '../index';
import {XORCipher} from '../utils/encrypt';


const VERSION_APP = environment.versionApp;
const SALT = 'strimi';
@Injectable()
export class LocalStorageSrvice {


  init() {
    const storage = localStorage.getItem(Constants.STORAGE_STRIMI);
    if (!storage) {
      this.createNewStorage();
    } else {
      this.checkAppVersion(JSON.parse(storage));
    }
  }

  checkAppVersion(storage: StrimiStorage) {
    this.checkHasProperty(storage);
    if (storage.versionApp !== VERSION_APP) {
      localStorage.removeItem(Constants.STORAGE_STRIMI);
      this.createNewStorage();
    }
  }

  checkHasProperty(storage: StrimiStorage) {
    if (!storage['versionApp']) {
      localStorage.removeItem(Constants.STORAGE_STRIMI);
      this.createNewStorage();
    }
  }

  getLocalStorage(): StrimiStorage {
    const storage = localStorage.getItem(Constants.STORAGE_STRIMI);
    return <StrimiStorage>JSON.parse(storage);
  }

  createNewStorage() {
    const newStorage = new StrimiStorage();
    newStorage.versionApp = VERSION_APP;
    this.saveLocalStorage(newStorage);
  }

  saveLocalStorage(storage: StrimiStorage) {
    localStorage.setItem(Constants.STORAGE_STRIMI, JSON.stringify(storage));
  }

  saveTheme(theme: string) {
    const storage = this.getLocalStorage();
    storage.theme = theme;
    this.saveLocalStorage(storage);
  }

  getThemeStorage(): string {
    const storage = this.getLocalStorage();
    if (storage) {
      return storage.theme;
    } else {
      return null;
    }
  }

  shouldShowBanner() {
    return this.getLocalStorage().showBanner;
  }

  aggreeBanner() {
    const storage = this.getLocalStorage();
    storage.showBanner = false;
    this.saveLocalStorage(storage);
  }

  showCookies(): boolean {
    return this.getLocalStorage().showCookies;
  }

  aggreeCookies() {
    const storage = this.getLocalStorage();
    storage.showCookies = false;
    this.saveLocalStorage(storage);
  }

  logIn(login, pass) {
    const storage = this.getLocalStorage();
    const encodePass = XORCipher.encode(SALT, pass);
    const encodeLogin = XORCipher.encode(SALT, login);
    storage.login = encodeLogin;
    storage.pass = encodePass;
    this.saveLocalStorage(storage);
  }

  logOutUser() {
    const storage = this.getLocalStorage();
    storage.login = null;
    storage.pass = null;
    this.saveLocalStorage(storage);
  }

  getUserData(): UserLogin {
    const storage = this.getLocalStorage();
    if (storage && storage.pass && storage.login) {
      const login = XORCipher.decode(SALT, storage.login);
      const pass = XORCipher.decode(SALT, storage.pass);
      return new UserLogin(login, pass);
    } else {
      return null;
    }
  }

}

