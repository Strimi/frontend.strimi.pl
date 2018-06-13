import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SafeResourceUrl} from '@angular/platform-browser';

import {PostResult, StrimiMetadata} from '../../../..';

const isYouTube = ['m.youtube.com', 'youtube.com', 'www.youtube.com', 'youtu.be'];
const isViemo = ['vimeo.com'];
const isFacebook = ['www.facebook.com', 'www.fb.com', 'facebook.com', 'fb.com'];
const isDailyMotion = ['dailymotion.com', 'dai.ly'];
const isLiveleak = ['liveleak.com'];
const isTwich = ['twitch.tv'];
const isSoundCloud = ['soundcloud'];

/**
 * Parse strimi post, type: video.
 */
@Component({
  selector: 'app-post-video',
  templateUrl: './post-video.component.html'
})
export class PostVideoComponent {

  video: SafeResourceUrl;
  post: PostResult;
  metaStrimi: StrimiMetadata;

  @Input()
  showEdit: boolean;
  @Input()
  showDelete: boolean;
  @Input()
  showDownVote: boolean;
  @Output()
  postToEdit = new EventEmitter<PostResult>();
  @Output()
  postToDelete = new EventEmitter<PostResult>();

  @Input()
  set postResult(postResult: PostResult) {
    this.post = postResult;
    this.metaStrimi = postResult.json_metadata.strimi_metadata;
    this.video = this.selectEmbedURL(this.metaStrimi.type.type_from, this.metaStrimi.video);
  }

  selectEmbedURL(videoType: string, idVideo: string) {
    if (isYouTube.includes(videoType)) {
      return `https://www.youtube.com/embed/${idVideo}?rel=0&amp;showinfo=1&autoplay=0&iv_load_policy=3`;
    } else if (isViemo.includes(videoType)) {
      return `https://player.vimeo.com/video/${idVideo}?color=4f5875&;autoplay=0`;
    } else if (isFacebook.includes(videoType)) {
      // tslint:disable-next-line:max-line-length
      return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/${idVideo}?show_text=false&autoplay=false&mute=0`;
    } else if (isDailyMotion.includes(videoType)) {
      return `//www.dailymotion.com/embed/video/${idVideo}?autoplay=false`;
    } else if (isLiveleak.includes(videoType)) {
      return `http://www.liveleak.com/ll_embed?f=${idVideo}&autostart=false`;
    } else if (isTwich.includes(videoType)) {
      return `https://player.twitch.tv/?video=v${idVideo}&autoplay=false`;
    } else if (isSoundCloud.includes(videoType)) {
      // tslint:disable-next-line:max-line-length
      return `//w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/${idVideo}&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=true`;
    } else {
      return null;
    }
  }
}
