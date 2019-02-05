import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Servicios
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: [
    './recover-password.component.scss',
    '../../styles/center-column.style.scss'
  ]
})
export class RecoverPasswordComponent implements OnInit {

  accessToken: string;
  error = false;
  errorService;

  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) =>
      this.setAccessToken(params['access_token'])
    );
  }

  setAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
  }

  reestablecerPassword(password: string, password2: string) {
    if (password === password2) {
      this.userService.resetPassword(password, this.accessToken)
        .then(response => this.manageError(false),
              error => this.manageError(true, error)
        );
    } else {
      this.error = true;
    }
  };

  manageError(errorStatus: boolean, error?): void {
    this.errorService = errorStatus;
    if (errorStatus) {
      console.log(error);
    } else {
      this.router.navigate(['/login'], { queryParams: { password_reset: true } });
    }
  };

}
