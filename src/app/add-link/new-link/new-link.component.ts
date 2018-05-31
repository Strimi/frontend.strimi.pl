import {Component, OnInit} from '@angular/core';
import {PostService} from '../../shared/services/post.service';
import {NewLinkService} from '../../shared/services/new-link/new-link.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-link',
  templateUrl: './new-link.component.html'
})
export class NewLinkComponent implements OnInit {

  link: string;
  errorLink = false;

  constructor(private postService: PostService, private newLinkService: NewLinkService, private router: Router) {
  }

  ngOnInit() {
  }

  recognizeLink() {
    this.errorLink = false;
    this.postService.recognizeLink(this.link).subscribe(recognizeLink => {
      this.newLinkService.recognizedLink.next(recognizeLink);
      this.router.navigate(['/new-post'], {queryParams: {newLink: true}});
    }, error => {
      this.errorLink = true;
    });
  }

  notDisable(): boolean {
    return this.link && this.link.trim() !== '';
  }

}
