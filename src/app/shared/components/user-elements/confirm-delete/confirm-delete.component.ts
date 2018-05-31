import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html'
})
export class ConfirmDeleteComponent implements OnInit {

  modal: NgbModalRef;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }


  confrim() {
    this.activeModal.close(true);
  }

}
