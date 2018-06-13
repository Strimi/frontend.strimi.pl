import {Component, Input, OnInit} from '@angular/core';

import {LoggedData, PostResult} from '../../../models';
import {AuthService} from '../../../services/auth/auth.service';
import {postAfter7Days} from '../../../index';
import {Router} from '@angular/router';
import {ConfirmDeleteComponent} from '../../user-elements/confirm-delete/confirm-delete.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PostService} from '../../../services/post.service';
import {DeletingErrorModalComponent} from '../../user-elements/deleting-error-modal/deleting-error-modal.component';
import {DeletingSpinnerModalComponent} from '../../user-elements/deleting-spinner-modal/deleting-spinner-modal.component';

@Component({
  selector: 'app-posts-container',
  templateUrl: './posts-container.component.html'
})
export class PostsContainerComponent implements OnInit {


  @Input()
  posts: Array<PostResult> = [];
  loggedData: LoggedData;

  constructor(private authService: AuthService, private router: Router, private modalService: NgbModal, private postService: PostService) {
    this.authService.isLogged().subscribe(user => {
      this.loggedData = user;
    });
  }

  ngOnInit() {
  }

  isImage(post: PostResult) {
    const jsonMeta = post.json_metadata;
    return jsonMeta.strimi_metadata && jsonMeta.strimi_metadata.thumb || jsonMeta.image && jsonMeta.image[0];
  }

  onEdit(post: PostResult) {
    this.router.navigate(['/new-post'], {queryParams: {author: post.author, permlink: post.permlink}});
  }

  showEdit(post: PostResult) {
    return this.loggedData
      && this.loggedData.loginData.login === post.author
      && postAfter7Days(post.created);
  }

  showDelete(post: PostResult) {
    return this.loggedData
      && this.loggedData.loginData.login === post.author
      && postAfter7Days(post.created)
      && post.children === 0 && post.net_votes === 0;
  }

  showDownVote(post: PostResult) {
    return this.loggedData
      && postAfter7Days(post.created);
  }

  onDeletePost(post: PostResult) {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {windowClass: 'modal-user-settings'});
    modalRef.result.then(result => {
      const deletingModal = this.modalService.open(DeletingSpinnerModalComponent, {windowClass: 'modal-user-settings'});
      this.postService.deletePost(this.loggedData.loginData.pass, post.author, post.permlink)
        .subscribe(response => {
          deletingModal.close();
          window.location.reload();
        }, error => {
          this.modalService.open(DeletingErrorModalComponent, {windowClass: 'modal-user-settings'});
        });
    }, err => {
      // cancel modal window do nothing
    });
  }
}
