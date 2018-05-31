import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PostResult } from '../../../index';


@Component({
  selector: 'app-add-content-post',
  templateUrl: './add-content-post.component.html'
})
export class AddContentPostComponent {

  @Input()
  text: string = null;

  @Input()
  showSpinner = false;

  @Input()
  showError = false;

  @Input()
  errorLimitTime = false;

  @Input()
  showCancel = false;

  isEdited = false;

  @Output()
  message = new EventEmitter<string>();

  @Output()
  editedMessage = new EventEmitter<string>();

  @Output()
  isCancel = new EventEmitter<boolean>();

  @Input()
  set editPost(post: PostResult) {
    if (post) {
      this.isEdited = true;
      this.text = post.body;
    } else {
      this.isEdited = false;
    }
  }


  submit() {
    if (this.isEdited) {
      this.editedMessage.emit(this.text);
    } else {
      this.message.emit(this.text);
    }
  }

  onCancel() {
    this.text = null;
    this.isCancel.emit(true);
  }

  dissableButton() {
    return !(this.text && this.text.trim() !== '');
  }

}
