import { Component, OnInit } from '@angular/core';
import { User } from '../../../index';
import { UsersRankingService } from '../../../services/users-ranking.service';

/**
 * Component with input search for serach users,
 * and shows them on list
 */
@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  providers: [UsersRankingService]
})
export class UserSearchComponent implements OnInit {

  users: Array<User>;

  constructor(private userService: UsersRankingService) { }

  ngOnInit() {
    this.userService.users.subscribe(users => {
      this.users = users;
    });
  }


  onValueChange(value) {
    if (value) {
      this.userService.getUsersSuggestFor(value);
    } else {
      this.userService.users.next([]);
    }
  }
}
