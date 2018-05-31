import {Component} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ApplicationService } from '../../shared/services/application.service';

@Component({
  selector: 'app-modal-menu',
  templateUrl: './modal-menu.component.html'
})
export class ModalMenuComponent  {

  constructor(private modalService: NgbModal) {}

  open(content) {
    this.modalService.open(content, { windowClass: 'modal-mobile-global-menu' });
  }



}
