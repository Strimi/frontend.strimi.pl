import { Component, OnInit } from '@angular/core';
import { LocalStorageSrvice } from '../../../services/local-storage.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html'
})
export class BannerComponent implements OnInit {

  constructor(private localStorage: LocalStorageSrvice) { }

  ngOnInit() {
  }

  agree(){
    this.localStorage.aggreeBanner();
  }

}
