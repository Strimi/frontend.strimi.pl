import { Component, OnInit, Input } from '@angular/core';

/**
 * Shows number of comments
 */
@Component({
  selector: 'app-comments-post',
  templateUrl: './comments-post.component.html'
})
export class CommentsPostComponent implements OnInit {

  @Input()
  children: number;

  constructor() { }

  ngOnInit() {
  }

}
