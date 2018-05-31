import {Component, OnInit} from '@angular/core';
import {UserStrimiService} from '../../../../shared/services/user-strimi.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Profile, UserJsonMetadata, UserStrimi} from '../../../../shared/models';
import {SettingModalComponent} from '../../../../shared/components/user-elements';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../../shared/services/auth/auth.service';


@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html'
})
export class UserSettingsComponent implements OnInit {

  profile: Profile = {};
  user: UserStrimi;
  showSpinner = false;
  showError = false;
  showInfoUpdatea: boolean;

  constructor(
    private userService: UserStrimiService,
    private route: ActivatedRoute,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      const authorName = params['authorName'].replace('@', '');
      this.userService.getUser(authorName).subscribe((user: UserStrimi) => {
        this.user = user;
        if (user.json_metadata && user.json_metadata.profile) {
          this.profile = user.json_metadata.profile;
        }
      });
    });
  }

  onSubmit() {
    this.open();
  }

  open() {
    const modalRef = this.modalService.open(SettingModalComponent, {windowClass: 'modal-user-settings'});
    modalRef.result.then(wif => {
      this.updateAccount(wif);
    }, err => {
      // cancel modal window do nothing
    });
  }

  updateAccount(wif: string) {
    this.showSpinner = true;
    this.showError = false;
    this.showInfoUpdatea = false;
    const json: UserJsonMetadata = {profile: this.profile};
    this.userService.accountUpdate(json, wif, this.user.memo_key, this.user.name).subscribe(response => {
      const jsonUser = response.operations[0][1].json_metadata;
      const jsonProfile: UserJsonMetadata = JSON.parse(jsonUser);
      this.profile = jsonProfile.profile;
      this.showSpinner = false;
      this.showInfoUpdatea = true;
    }, err => {
      this.showSpinner = false;
      this.showError = true;
    });
  }
}
