import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatChipInputEvent} from '@angular/material';
import {TagRankingService} from '../../shared/services/tag-ranking.service';
import {Constants, PAYOUT_TYPE, PayoutType} from '../../shared/settings';
import {createImgForLinkPost, NewPost, PostResult} from '../../shared/index';
import {AddContentService} from '../../shared/services/add-content/add-content.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PostService} from '../../shared/services/post.service';
import {createFooterForPost} from '../../shared';
import {NewLinkService} from '../../shared/services/new-link/new-link.service';
import {RecognizedLink} from '../../shared/models/recognize-link.model';

const VALIDATOR = {
  title: {min: 10, max: 180},
  body: {min: 25, max: 25000},
  tags: {min: 1, max: 5}
};

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  providers: [AddContentService]
})

export class NewPostComponent implements OnInit {

  newPost = new NewPost();
  slectedTags = [];

  @ViewChild('input')
  input: any;

  payoutType: PayoutType[] = PAYOUT_TYPE;
  separatorKeysCodes = [ENTER, COMMA, SPACE];
  filteredTags = new Array<string>();
  showSpinner = false;
  showError = false;
  errorLimitTime = false;
  showSelectReward = true;
  editMode = false;
  postToEdit: PostResult;

  recognizedLink: RecognizedLink; // if not null then is mode to add new link
  linkPost: boolean;

  constructor(
    public tagService: TagRankingService,
    private contentService: AddContentService,
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private newLinkService: NewLinkService
  ) {
    this.route.queryParams.subscribe((param: Params) => {
      const author = param['author'];
      const permlink = param['permlink'];
      const newLink = param['newLink'];
      if (author && permlink) {
        this.postService.getDetailPost(author, permlink).subscribe(post => {
          this.postToEdit = post;
          this.postToUpdate(post);
        });
      } else if (newLink) {
        this.linkPost = true;
        this.newLinkService.getRecognizedLink().subscribe(recognizedPost => {
          if (recognizedPost) {
            this.recognizedLink = recognizedPost;
            this.newLinkPost();
          } else {
            this.router.navigate(['/new-link']);
          }
        });
      }
    });
  }

  ngOnInit() {
    this.newPost.reward = this.payoutType[0].value;
  }

  onSubmit() {
    this.showSpinner = true;
    this.showError = false;
    this.errorLimitTime = false;
    this.checkForAdult();
    this.newPost.tags = [...this.slectedTags];
    if (this.editMode) {
      this.selectToEdit();
    } else if (this.recognizedLink) {
      this.addNewLinkPost();
    } else {
      this.addNewPost();
    }
  }

  selectToEdit() {
    if (this.isLinkPost()) {
      this.updateLinkPost();
    } else {
      this.updatePost();
    }
  }

  addNewPost() {
    this.contentService.createPost(this.newPost, this.callbackError, this.callbackSucces);
  }

  updatePost() {
    this.contentService.updatePost(this.newPost, this.postToEdit, this.callbackError, this.callbackSucces);
  }

  addNewLinkPost() {
    this.contentService.createLinkPost(this.newPost, this.recognizedLink, this.callbackError, this.callbackSucces);
  }

  updateLinkPost() {
    this.contentService.updateLinkPost(this.newPost, this.postToEdit, this.callbackError, this.callbackSucces);
  }

  checkForAdult() {
    const value = this.newPost.forAdult.toString();
    if (value === 'true' && !this.slectedTags.includes(Constants.NSFW_TAG) && !this.slectedTags.includes(Constants.NSFW_TAG.toUpperCase())) {
      this.slectedTags.push(Constants.NSFW_TAG);
    } else {
      this.slectedTags = this.slectedTags.filter(e => e !== Constants.NSFW_TAG && e !== Constants.NSFW_TAG.toUpperCase());
    }
  }


  callbackSucces = (prePost) => {
    this.router.navigate([`/${prePost.parent_permlink}/@${prePost.author}/${prePost.permlink}`]);
  };

  callbackError = (error) => {
    this.showSpinner = false;
    if (error && error.code && error.code === -32000) {
      this.errorLimitTime = true;
    } else {
      this.showError = true;
    }
  };

  valueChange(value) {
    if (value && value !== '') {
      this.tagService.returnSuggestedTag(value).subscribe(tags => {
        this.filteredTags = tags.slice(0, 25);
      });
    } else {
      this.filteredTags = [];
    }
  }

  onSelectionChange(event) {
    if (event && event.isUserInput) {
      this.addSuggestedTag(event.source.value);
      this.input.nativeElement.value = null;
    }
  }

  addSuggestedTag(value: string): void {
    this.addToTags(value);
  }

  add(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.addToTags(value);
    }
    if (input) {
      input.value = '';
    }
  }

  remove(state: any): void {
    const index = this.slectedTags.indexOf(state);
    if (index >= 0) {
      this.slectedTags.splice(index, 1);
    }
  }

  addToTags(tag: string) {
    if (!this.slectedTags.includes(tag) && this.slectedTags.length < 5) {
      this.slectedTags.push(tag);
    }
  }

  selectedNsfw(value: string) {
    if (value === 'true') {
      this.slectedTags.push(Constants.NSFW_TAG);
    } else if (value === 'false') {
      this.slectedTags = this.slectedTags.filter(e => e !== Constants.NSFW_TAG);
    }
  }

  isValid(): boolean {
    return this.isTitleValid() && this.isBodyValid() && this.isTagsValid();
  }

  isTitleValid = () => {
    return this.newPost.title != null
      && this.newPost.title.trim().length >= VALIDATOR.title.min
      && this.newPost.title.trim().length <= VALIDATOR.title.max;
  };

  isBodyValid = () => {
    return this.newPost.body != null
      && this.newPost.body.trim().length >= VALIDATOR.body.min
      && this.newPost.body.trim().length <= VALIDATOR.body.max;
  };

  isTagsValid = () => {
    return this.slectedTags.length >= VALIDATOR.tags.min
      && this.slectedTags.length <= VALIDATOR.tags.max;
  };


  postToUpdate(post: PostResult) {
    this.editMode = true;
    this.showSelectReward = false;
    const editPost = new NewPost();
    let text = post.body.replace(createFooterForPost(post.author, post.permlink), '');

    if (this.isLinkPost()) {
      text = text.replace(createImgForLinkPost(post.author, post.permlink, post.json_metadata.strimi_metadata.thumb), '');
      this.linkPost = true;
    }
    editPost.body = text;
    editPost.title = post.title;
    this.newPost = editPost;
    this.slectedTags = post.json_metadata.tags.filter(e => e !== Constants.STRIMI_TAG && e !== Constants.STRIMI_TAG_PL);
    this.newPost.forAdult = post.json_metadata.tags.includes(Constants.NSFW_TAG)
      || post.json_metadata.tags.includes(Constants.NSFW_TAG.toUpperCase());
  }

  newLinkPost() {
    const linkPost = new NewPost();
    linkPost.body = this.recognizedLink.description.substring(0, 179);
    linkPost.title = this.recognizedLink.title;
    this.newPost = linkPost;
  }

  isLinkPost() {
    return this.postToEdit.json_metadata
      && this.postToEdit.json_metadata.strimi_metadata
      && this.postToEdit.json_metadata.strimi_metadata.type.type !== 'text';
  }

}
