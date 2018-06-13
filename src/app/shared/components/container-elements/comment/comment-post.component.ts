import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {postAfter7Days, PostResult} from '../../..';
import {LoggedData} from '../../../models';
import {AddContentService} from '../../../services/add-content/add-content.service';
import {PostService} from '../../../services/post.service';

/**
 * Shows single comment but by recursion
 * shows them all.
 */
@Component({
  selector: 'app-comment-post',
  templateUrl: './comment-post.component.html',
})
export class CommentPostComponent implements OnInit {


  hideComment: boolean;
  showReply: boolean;

  showSpinner = false;
  showError = false;
  errorLimitTime = false;
  text = null;
  showEdit = false;
  showDelete = false;
  showDownVote = false;
  isEdited = false;

  @Input()
  comment: PostResult;
  @Input()
  addContentService: AddContentService;
  @Input()
  postService: PostService;
  @Input()
  isLogged: LoggedData;
  @Output()
  onDelete = new EventEmitter<PostResult>();

  ngOnInit(): void {
    this.showEdit = this.isLogged
      && this.isLogged.loginData.login === this.comment.author
      && postAfter7Days(this.comment.created);


    this.showDelete = this.isLogged
      && this.isLogged.loginData.login === this.comment.author
      && postAfter7Days(this.comment.created)
      && this.comment.children === 0 && this.comment.net_votes === 0;

    this.showDownVote = this.isLogged && postAfter7Days(this.comment.created);
  }

  sendNewComment(commentPost) {
    this.showSpinner = true;
    this.showError = false;
    this.errorLimitTime = false;
    this.addContentService.sendCommentPost(this.comment.author, this.comment.permlink, commentPost,
      this.callbackError, this.callbackSucces);
  }

  callbackSucces = (prePost) => {
    this.postService.getDetailPost(prePost.author, prePost.permlink).subscribe(post => {
      if (this.comment.comments) {
        this.comment.comments.push(post);
      } else {
        this.comment.comments = [];
        this.comment.comments.push(post);
      }
      this.showSpinner = false;
      this.showReply = false;
      this.text = null;
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

  onEditComment(editedComment) {
    this.showSpinner = true;
    this.showError = false;
    this.errorLimitTime = false;
    this.addContentService.sendEditComment(this.comment, editedComment,
      this.callbackError, this.editCallbackSucces);
  }


  editCallbackSucces = (prePost) => {
    this.postService.getDetailPost(prePost.author, prePost.permlink).subscribe(post => {
      post.comments = [...this.comment.comments]; // this is hack because we dont have in detail post all comments for optymalization
      this.comment = post;
      this.showSpinner = false;
      this.showReply = false;
      this.text = null;
    });
  };

  onCancel() {
    this.showReply = false;
    this.isEdited = false;
  }

  onEditPost() {
    this.showReply = true;
    this.isEdited = true;
  }
}
