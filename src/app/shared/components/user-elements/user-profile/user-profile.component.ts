import { Component, OnInit, Input } from '@angular/core';
import { UserStrimi } from '../../../index';

/**
 * Shows all information about user in user profile.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styles: []
})
export class UserProfileComponent implements OnInit {

  @Input()
  user: UserStrimi;

  constructor() { }

  ngOnInit() {
  }

  extractHostname(url) {
    let hostname;

    // find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf('://') > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }

    // find & remove port number
    hostname = hostname.split(':')[0];
    // find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
  }

}
