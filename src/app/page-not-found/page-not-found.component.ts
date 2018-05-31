import { Component, OnInit, Renderer2 } from '@angular/core';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    //this.renderer.removeClass(document.body, THEME_DARK);
  }

}
