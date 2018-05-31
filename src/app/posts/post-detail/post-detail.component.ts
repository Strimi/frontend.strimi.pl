import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {LoggedData, postAfter7Days, PostResult} from '../../shared';
import {UserStrimi} from '../../shared/models';
import {UserStrimiService} from '../../shared/services/user-strimi.service';
import {PostService} from '../../shared/services/post.service';
import {AuthService} from '../../shared/services/auth/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDeleteComponent} from '../../shared/components/user-elements/confirm-delete/confirm-delete.component';

/**
 * Container for post detail.
 * Render post detail and comments.
 */
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html'
})
export class PostDetailComponent implements OnInit, AfterViewInit {


  @ViewChildren('commentsRef') commentsRef: QueryList<any>;

  post: PostResult;
  showSpinner: boolean;
  author: UserStrimi;
  postError: boolean;
  loggedData: LoggedData;
  showEdit: boolean;
  showDelete: boolean;
  isDeleting: boolean;
  deleteError: boolean;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private userService: UserStrimiService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.getPosts();
    this.authService.isLogged().subscribe(loggedData => {
      this.loggedData = loggedData;
      this.showEdit = loggedData
        && loggedData.loginData.login === this.post.author
        && postAfter7Days(this.post.created);

      this.showDelete = loggedData
        && loggedData.loginData.login === this.post.author
        && postAfter7Days(this.post.created)
        && this.post.children === 0 && this.post.net_votes === 0;
    });
  }

  getPosts() {
    const result = this.route.snapshot.data['postDetail'];
    this.route.data.subscribe(dataRoute => {
      this.showSpinner = true;
      if (result) {
        this.post = result;
        this.userService.getUser(result.author).subscribe(user => this.author = user);
        this.showSpinner = false;
      } else {
        this.postError = true;
        this.showSpinner = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'comments') {
        this.scrollToComments();
      }
    });
  }

  scrollToComments() {
    this.commentsRef.changes.subscribe((elem: QueryList<any>) => {
      elem.first.nativeElement.scrollIntoView();
    });
  }

  onEditPost(post: PostResult) {
    this.router.navigate(['/new-post'], {queryParams: {author: post.author, permlink: post.permlink}});
  }

  onDeletePost(post: PostResult) {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {windowClass: 'modal-user-settings'});
    modalRef.result.then(result => {
      this.isDeleting = true;
      this.deleteError = false;
      this.postService.deletePost(this.loggedData.loginData.pass, post.author, post.permlink)
        .subscribe(response => {
          this.isDeleting = false;
          this.router.navigate(['/']);
        }, error => {
          this.isDeleting = false;
          this.deleteError = true;
        });
    }, err => {
      // cancel modal window do nothing
    });
  }

}
