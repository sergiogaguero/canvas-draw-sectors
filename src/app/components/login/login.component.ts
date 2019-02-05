// angular basics
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Servicios
import { AuthService } from '../../services/auth.service';

// regex
import { Pattern } from '../../classes/patterns';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: [
        './login.component.scss',
        '../../styles/center-column.style.scss'
    ]
})

export class LoginComponent implements OnInit {

    errorLogin = false;

    recordLogin = true;

    passwordFormControl = new FormControl('', Validators.required);

    /* Maquetado de mensaje de error */
    error = false;
    restablecida = false;
    /* Maquetado de mensaje de error */


    emailFormControl = new FormControl('', [Validators.required, Validators.pattern(Pattern.getEmail())]);
    userToLogin = new FormGroup({
        'email': this.emailFormControl,
        'password': this.passwordFormControl,
        'recordar': new FormControl(this.recordLogin)
    });

    constructor(
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => this.setPasswordResetState(params));
    }

    setPasswordResetState(params: Params): void {
        if (params['password_reset']) {
            this.restablecida = params['password_reset'];
        }
    }

    login() {
        if (this.userToLogin.valid) {
            this.authService.login(this.userToLogin.value).subscribe(
                response => {
                    if (this.userToLogin.controls['recordar'].value === true) {
                        localStorage.setItem('currentUser', JSON.stringify(response));
                    } else {
                        sessionStorage.setItem('currentUser', JSON.stringify(response));
                    }
                    this.userToLogin.reset();
                    this.router.navigateByUrl(this.authService.getRedirectUrl());
                },
                error => {
                    this.errorLogin = true;
                });
        } else {
            // validate all form fields
            Object.keys(this.userToLogin.controls).forEach(field => {
                const control = this.userToLogin.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }

}
