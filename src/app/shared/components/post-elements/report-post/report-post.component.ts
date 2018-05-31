import {Component, EventEmitter, Input, Output} from '@angular/core';

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

  @Output()
  edit = new EventEmitter<void>();
  @Output()
  delete = new EventEmitter<void>();

  editPost() {
    this.edit.next();
  }

  deletePost() {
    this.delete.next();
  }
}
