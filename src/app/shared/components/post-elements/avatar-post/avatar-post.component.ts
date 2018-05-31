import { Component, OnInit, Input } from '@angular/core';

/**
 * Shows avatar
 */
@Component({
  selector: 'app-avatar-post',
  templateUrl: './avatar-post.component.html',
  styles: []
})
export class AvatarPostComponent implements OnInit {

  @Input()
  author: string;
  @Input()
  classStyle: string;

  avatarUrl: string;


  ngOnInit() {
    this.avatarUrl = `url(https://cdn.steemitimages.com/u/${this.author}/avatar)`;
  }

}
