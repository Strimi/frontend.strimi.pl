import { Component } from '@angular/core';

import { PostService } from '../../shared/services/post.service';
import { LocalStorageSrvice } from '../../shared/services/local-storage.service';
import { AuthService } from '../../shared/services/auth/auth.service';

import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  isLogged: boolean;

  constructor(public postSrvice: PostService, public localStorage: LocalStorageSrvice, public authService: AuthService) {
    this.authService.isLogged().subscribe(value => this.isLogged = value ? true : false);
  }

  agree() {
    this.localStorage.aggreeCookies();
  }

}
