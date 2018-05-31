import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ban-page',
  templateUrl: './ban-page.component.html',
  styles: []
})
export class BanPageComponent implements OnInit {

  bannedType: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.bannedType = this.route.snapshot.params['path'];
  }

}
