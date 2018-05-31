import {Component, OnInit} from '@angular/core';

import {CommonContent, LoggedData, PostResult, SortModel} from '../../shared';
import {AddContentService} from '../../shared/services/add-content/add-content.service';
import {AuthService} from '../../shared/services/auth/auth.service';
import {NotificationService} from '../../shared/services/notifications/notification.service';
import {PostService} from '../../shared/services/post.service';
import {Router} from '@angular/router';
import {DeletingSpinnerModalComponent} from '../../shared/components/user-elements/deleting-spinner-modal/deleting-spinner-modal.component';
import {DeletingErrorModalComponent} from '../../shared/components/user-elements/deleting-error-modal/deleting-error-modal.component';
import {ConfirmDeleteComponent} from '../../shared/components/user-elements/confirm-delete/confirm-delete.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stream-posts',
  templateUrl: './stream-posts.component.html',
  providers: [AddContentService, NotificationService]
})
export class StreamPostsComponent extends CommonContent implements OnInit {

  sortParams = new SortModel();
  loggedData: LoggedData;
  postCount = 0;
  showSpinner = false;
  showError = false;
  errorLimitTime = false;
  textPost = null;

  constructor(
    private postService: PostService,
    public authService: AuthService,
    private addContentService: AddContentService,
    private notificationService: NotificationService,
    private router: Router,
    private modalService: NgbModal) {
    super();
    this.limitPost = 70;
    this.initNotifications();
  }

  initNotifications() {
    this.notificationService.initNotificationsStream();
    this.notificationService.numberStreamNotifications.asObservable().subscribe((count: number) => {
      this.postCount = count;
    });
  }

  ngOnInit() {
    this.authService.isLogged().subscribe(loggedData => {
      this.loggedData = loggedData;
    });
    this.getPosts();
  }

  getPosts() {
    this.getData(this.postService.getPostsStream(this.sortParams));
  }

  nextPosts() {
    const last = this.data[this.data.length - 1];
    this.getNext(this.postService.getNextPostsStream(last.author, last.permlink, this.sortParams));
  }

  onSort(params: SortModel) {
    this.sortParams = params;
    this.getPosts();
  }

  sendNewPost(streamPost) {
    this.showSpinner = true;
    this.showError = false;
    this.errorLimitTime = false;
    this.addContentService.sendStreamPost(streamPost, this.callbackError, this.callbackSucces);
  }

  callbackSucces = (prePost) => {
    this.postService.getDetailPostStream(prePost.author, prePost.permlink).subscribe(post => {
      this.data.unshift(post);
      this.showSpinner = false;
      this.textPost = null;
    });
  };

  callbackError = (error) => {
    this.showSpinner = false;
    if (error && error.code && error.code === -32000) {
      this.errorLimitTime = true;
    } else {
      this.showError = true;
    }
  };

  onEditPost(post: PostResult) {
    this.router.navigate([`/stream/detail/@${post.author}/${post.permlink}`], {queryParams: {edit: true}});
  }

  onDeletePost(post) {
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
