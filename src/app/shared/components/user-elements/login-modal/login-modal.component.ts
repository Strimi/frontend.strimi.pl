import {Component, Input} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UserLogin} from '../../../index';
import {AuthService} from '../../../services/auth/auth.service';
import * as steem from 'steem';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styles: []
})
export class LoginModalComponent {

  modal: NgbModalRef;
  loginModel = new UserLogin();
  isAccept: boolean;
  errInfo: string = null;
  @Input()
  buttonClass = 'btn btn-header-login';
  @Input()
  buttonText = 'header.top_menu.my_strimi.name';

  constructor(private modalService: NgbModal, private authService: AuthService, private router: Router) {
  }

  open(content) {
    this.modal = this.modalService.open(content, {windowClass: 'modal-login'});
  }


  onSubmit() {
    const result = steem.utils.validateAccountName(this.loginModel.login);
    if (!result) {
      this.authService.logIn(this.loginModel, this.errorCallback, this.modal);
    } else {
      this.errInfo = 'header.top_menu.my_strimi.bad_login';
    }
  }

  errorCallback = (info: string) => {
    this.errInfo = info;
  };

  goToRegulations(){
    this.router.navigate(['/pages/regulations']);
    this.modal.close();
  }

}
