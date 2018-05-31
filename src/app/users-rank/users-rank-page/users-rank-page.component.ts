import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { UsersRankingService } from '../../shared/services/users-ranking.service';
import { SerachInputComponent } from '../../shared/components/utils-elements/index';

@Component({
  selector: 'app-users-rank-page',
  templateUrl: './users-rank-page.component.html',
  providers: [UsersRankingService]
})
export class UsersRankPageComponent implements OnInit {

  displayedColumns = ['index', 'name', 'steemBalance', 'steemDolarBalance', 'upvoteWorth', 'steemPower'];

  dataSource = new MatTableDataSource();
  hiddenButton = false;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SerachInputComponent) inputSearch: SerachInputComponent;

  constructor(private userService: UsersRankingService) {
    this.userService.getUsers();
  }

  nextUsers() {
    this.userService.getNextUsers(this.sort.active, this.sort.direction, this.dataSource.data.length.toString());
  }

  ngOnInit() {
    this.userService.users.subscribe(users => {
      this.dataSource.data = users;
    });
    this.onSortChange();
  }

  onSortChange() {
    this.sort.sortChange.subscribe(sort => {
      this.userService.getUsers(sort.active, sort.direction);
      this.inputSearch.value = '';
      this.hiddenButton = false;
    });
  }

  onValueChange(value) {
    if (value) {
      this.hiddenButton = true;
      this.userService.getUsersSuggestFor(value);
    } else {
      this.hiddenButton = false;
      this.userService.getUsers();
    }
  }

  getIndex(row) {
    return this.dataSource.data.indexOf(row) + 1;
  }

}
