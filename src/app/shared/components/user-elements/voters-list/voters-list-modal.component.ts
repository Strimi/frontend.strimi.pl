import { Component, Input, OnInit } from '@angular/core';

import { ActiveVotes, PostResult } from '../../..';
import { UserStrimiService } from '../../../services/user-strimi.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-voters-list',
  templateUrl: './voters-list-modal.component.html'
})
export class VotersListComponent implements OnInit {

  @Input()
  post: PostResult;
  @Input()
  votes: number;

  modal: NgbModalRef;
  activeVotes: Array<ActiveVotes>;
  showError: boolean;
  showSpinner: boolean;

  constructor(private userService: UserStrimiService, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(content) {
    if (this.votes !== 0) {
      this.modal = this.modalService.open(content);
      this.getVoters();
    }
  }

  getVoters() {
    this.showSpinner = true;
    this.userService.calculateActiveVotes(this.post).subscribe(votes => {
      this.activeVotes = votes.sort(this.descSort);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      this.showError = true;
    });
  }

  closeModal() {
    this.modal.close();
  }

  private descSort = (a: ActiveVotes, b: ActiveVotes): number => {
    // tslint:disable-next-line:curly
    if (a.time.valueOf() > b.time.valueOf()) return -1;
    // tslint:disable-next-line:curly
    if (a.time.valueOf() < b.time.valueOf()) return 1;
    return 0;
  }

}
