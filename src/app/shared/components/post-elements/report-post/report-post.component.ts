import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DownVoteComponent} from '../../user-elements/down-vote/down-vote.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PostResult} from '../../../models';
import {postAfter7Days} from '../../../utils';

/**
 * Represent small flag to report posts
 */
@Component({
  selector: 'app-report-post',
  templateUrl: './report-post.component.html',
  styles: []
})
export class ReportPostComponent {

  @Input()
  classReport: string;
  @Input()
  classRemove: string;
  @Input()
  classEdit: string;

  @Input()
  showEdit: boolean;
  @Input()
  showDelete: boolean;
  @Input()
  showDownVote: boolean;

  @Input()
  post: PostResult;

  @Output()
  edit = new EventEmitter<void>();
  @Output()
  delete = new EventEmitter<void>();

  constructor(private modalService: NgbModal) {
  }

  editPost() {
    this.edit.next();
  }

  deletePost() {
    this.delete.next();
  }

  openDownVote() {
    const modalRef = this.modalService.open(DownVoteComponent, {windowClass: 'null'});
    modalRef.componentInstance.post = this.post;

  }
}
