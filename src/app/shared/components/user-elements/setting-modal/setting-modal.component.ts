import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-setting-modal',
  templateUrl: './setting-modal.component.html',
  styles: []
})
export class SettingModalComponent implements OnInit {

  activeWIF: string;
  modal: NgbModalRef;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }


  save() {
    this.activeModal.close(this.activeWIF);
  }
}
