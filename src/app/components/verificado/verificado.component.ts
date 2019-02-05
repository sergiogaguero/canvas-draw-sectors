import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
// Servicios
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-verificado',
    templateUrl: './verificado.component.html',
    styleUrls: ['./verificado.component.scss',
        '../../styles/center-column.style.scss']
})
export class VerificadoComponent implements OnInit {
    error = false;

    constructor(
        private userService: UserService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) =>
            this.confirmEmailAccount(params['uid'], params['token'])
        );

    }

    manageError(errorStatus: boolean, error?): void {
        this.error = errorStatus;
        if (errorStatus) {
            console.log(error);
        }
    };

    confirmEmailAccount(uid: string, token: string) {
        this.userService.confirmAccount(uid, token)
            .then(response => this.manageError(false),
                error => this.manageError(true, error));
    };

}
