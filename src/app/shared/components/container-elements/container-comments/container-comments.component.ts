import {Component, Input, OnInit} from '@angular/core';

import {CommonContent, PostResult} from '../../..';
import {AddContentService} from '../../../services/add-content/add-content.service';
import {PostService} from '../../../services/post.service';
import {Constants} from '../../../settings/settings';
import {AuthService} from '../../../services/auth/auth.service';
import {LoggedData} from '../../../models/user-login.model';
import {DeletingSpinnerModalComponent} from '../../user-elements/deleting-spinner-modal/deleting-spinner-modal.component';
import {DeletingErrorModalComponent} from '../../user-elements/deleting-error-modal/deleting-error-modal.component';
import {ConfirmDeleteComponent} from '../../user-elements/confirm-delete/confirm-delete.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

/**
 * Container componnet to shows comments.  ;)
 */
@Component({
  selector: 'app-container-comments',
  templateUrl: './container-comments.component.html',
  providers: [AddContentService]
})
export class ContainerCommentsComponent extends CommonContent implements OnInit {

  const = Constants;
  selected = Constants.SORT_BEST;
  countComments: number;

  showSpinnerComment = false;
  showError = false;
  errorLimitTime = false;
  text = null;
  isLogged: LoggedData;

  postResult: PostResult;

  @Input()
  set post(post: PostResult) {
    if (post) {
      this.postResult = post;
      this.countComments = post.children;
      this.getComments(post.author, post.permlink);
    }
  }

  constructor(public postService: PostService,
              public addContentService: AddContentService,
              public authService: AuthService,
              private modalService: NgbModal) {
    super();
    this.authService.isLogged().subscribe(isLooged => {
      this.isLogged = isLooged;
    });
  }

  ngOnInit() {
  }

  getComments(authorName: string, permlink: string) {
    this.getData(this.postService.getCommentsPost(authorName, permlink));
  }

  sortComments(value) {
    if (Constants.SORT_BEST === value) {
      this.data = this.data.sort(this.bestSort);
    } else if (Constants.SORT_DESC === value) {
      this.data = this.data.sort(this.descSort);
    } else if (Constants.SORT_ASC === value) {
      this.data = this.data.sort(this.ascSort);
    }
    this.selected = value;
  }

  private bestSort = (a: PostResult, b: PostResult): number => {
    return b.net_votes - a.net_votes;
  };

  private descSort = (a: PostResult, b: PostResult): number => {
    // tslint:disable-next-line:curly
    if (a.created > b.created) return -1;
    // tslint:disable-next-line:curly
    if (a.created < b.created) return 1;
    return 0;
  };

  private ascSort = (a: PostResult, b: PostResult): number => {
    // tslint:disable-next-line:curly
    if (a.created < b.created) return -1;
    // tslint:disable-next-line:curly
    if (a.created > b.created) return 1;
    return 0;
  };

  sendNewComment(commentPost) {
    this.showSpinnerComment = true;
    this.showError = false;
    this.errorLimitTime = false;
    this.addContentService.sendCommentPost(this.postResult.author, this.postResult.permlink, commentPost,
      this.callbackError, this.callbackSucces);
  }

  callbackSucces = (prePost) => {
    this.postService.getDetailPost(prePost.author, prePost.permlink).subscribe(post => {
      this.data.push(post);
      this.showSpinnerComment = false;
      this.text = null;
    });
  };

  callbackError = (error) => {
    this.showSpinnerComment = false;
    if (error && error.code && error.code === -32000) {
      this.errorLimitTime = true;
    } else {
      this.showError = true;
    }
  };

  onDeleteComment(post: PostResult) {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {windowClass: 'modal-user-settings'});
    modalRef.result.then(result => {
      const deletingModal = this.modalService.open(DeletingSpinnerModalComponent, {windowClass: 'modal-user-settings'});
      this.postService.deletePost(this.isLogged.loginData.pass, post.author, post.permlink)
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
