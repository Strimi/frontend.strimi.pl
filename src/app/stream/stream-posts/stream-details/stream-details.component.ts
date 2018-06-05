import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {postAfter7Days, PostResult} from '../../../shared';
import {UserStrimi} from '../../../shared/models';
import {UserStrimiService} from '../../../shared/services/user-strimi.service';
import {PostService} from '../../../shared/services/post.service';
import {AddContentService} from '../../../shared/services/add-content/add-content.service';
import {DeletingSpinnerModalComponent} from '../../../shared/components/user-elements/deleting-spinner-modal/deleting-spinner-modal.component';
import {DeletingErrorModalComponent} from '../../../shared/components/user-elements/deleting-error-modal/deleting-error-modal.component';
import {ConfirmDeleteComponent} from '../../../shared/components/user-elements/confirm-delete/confirm-delete.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stream-details',
  templateUrl: './stream-details.component.html',
  providers: [AddContentService]
})
export class StreamDetailsComponent implements OnInit {


  @Input()
  post: PostResult;
  author: UserStrimi;
  showSpinner: boolean;
  comments: Array<PostResult> = [];
  isEdit = false;
  showSpinnerUpdate = false;
  showError = false;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private userService: UserStrimiService,
    private addContentService: AddContentService,
    private modalService: NgbModal,
    private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param: Params) => {
      const authorName = param.get('authorName').replace('@', '');
      const permlink = param.get('permlink');
      this.showSpinner = true;
      this.postService.getDetailPostStream(authorName, permlink).subscribe(postDetail => {
        this.post = postDetail;

        this.userService.getUser(authorName).subscribe(user => {
          this.author = user;
        });
        this.postService.getCommentsPostStream(authorName, permlink).subscribe(resp => {
          this.comments = resp;
        });
        this.showSpinner = false;
      });
    });

    this.route.queryParams.subscribe((params: Params) => {
      const edit = params['edit'];
      if (edit) {
        this.isEdit = edit;
      }
    });
  }

  canReport() {
    return this.postService.loggedData !== null
      && postAfter7Days(this.post.created);
  }

  canEdit() {
    return this.postService.loggedData !== null
      && this.postService.loggedData.user.name === this.post.author
      && postAfter7Days(this.post.created);
  }

  canDelete() {
    return this.postService.loggedData
      && this.postService.loggedData.user.name === this.post.author
      && postAfter7Days(this.post.created)
      && this.post.children === 0 && this.post.net_votes === 0;
  }

  onEditPost() {
    this.isEdit = !this.isEdit;
  }

  onCancel() {
    this.isEdit = false;
  }

  onEditComment(editedPost) {
    this.showSpinnerUpdate = true;
    this.showError = false;
    this.addContentService.sendEditStreamPost(this.post, editedPost, this.callbackError, this.editCallbackSucces);
  }

  editCallbackSucces = (prePost) => {
    this.postService.getDetailPostStream(prePost.author, prePost.permlink).subscribe(post => {
      this.post = post;
      this.isEdit = false;
      this.showSpinnerUpdate = false;
    });
  };

  callbackError = (error) => {
    this.showSpinnerUpdate = false;
    if (error) {
      this.showError = true;
    }
  };

  onDeletePost() {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {windowClass: 'modal-user-settings'});
    modalRef.result.then(result => {
      const deletingModal = this.modalService.open(DeletingSpinnerModalComponent, {windowClass: 'modal-user-settings'});
      this.postService.deletePost(this.postService.loggedData.loginData.pass, this.post.author, this.post.permlink)
        .subscribe(response => {
          deletingModal.close();
          this.router.navigate(['/stream']);
        }, error => {
          this.modalService.open(DeletingErrorModalComponent, {windowClass: 'modal-user-settings'});
        });
    }, err => {
      // cancel modal window do nothing
    });
  }
}
