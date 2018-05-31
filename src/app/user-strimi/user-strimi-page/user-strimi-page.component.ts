import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserStrimi } from '../../shared';
import { UserStrimiService } from '../../shared/services/user-strimi.service';


/**
 * Thic component recive user form UserResover than procced to complet all data.
 */
@Component({
  selector: 'app-user-strimi-page',
  templateUrl: './user-strimi-page.component.html'
})
export class UserStrimiPageComponent implements OnInit {

  user: UserStrimi;

  constructor(private userService: UserStrimiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(dataRoute => {
      const user = dataRoute['user'];
      this.userService.getUser(null, user).subscribe(res => this.user = res);
    });
  }

}
