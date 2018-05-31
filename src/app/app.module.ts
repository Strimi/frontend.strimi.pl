import 'hammerjs';
import 'rxjs/add/operator/map';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';
import * as steem from 'steem';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FooterComponent} from './layout/footer/footer.component';
import {HeaderComponent} from './layout/header/header.component';
import {ModalMenuComponent} from './layout/modal-menu/modal-menu.component';
import {ApplicationService} from './shared/services/application.service';
import {AuthService} from './shared/services/auth/auth.service';
import {LocalStorageSrvice} from './shared/services/local-storage.service';
import {PopoverService} from './shared/services/popover/popover.service';
import {PostService} from './shared/services/post.service';
import {PostResolve} from './shared/services/reslovers/post-resolve';
import {TagsResolve} from './shared/services/reslovers/tags-resolve';
import {UserResolve} from './shared/services/reslovers/user-resolve';
import {TagRankingService} from './shared/services/tag-ranking.service';
import {UserStrimiService} from './shared/services/user-strimi.service';
import {SharedModule} from './shared/shared.module';
import {VoteService} from './shared/services/auth/vote.service';
import {SocketService} from './shared/services/notifications/socket.service';
import {NewLinkService} from './shared/services/new-link/new-link.service';
import {IsLoggedGuard} from './shared/services/guards/IsLoggedGuard';
import {IsYurProfileGuard} from './shared/services/guards/is-your-profile.guard';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


steem.api.setOptions({url: 'https://api.steemit.com'});

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, ModalMenuComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot(),
    ScrollToModule.forRoot(),
    BrowserAnimationsModule,
    SharedModule
  ],
  exports: [TranslateModule],
  providers: [ApplicationService, TagRankingService,
    UserStrimiService, LocalStorageSrvice, PostService,
    UserResolve, PostResolve, TagsResolve, AuthService, PopoverService,
    VoteService, SocketService, NewLinkService, IsLoggedGuard, IsYurProfileGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
