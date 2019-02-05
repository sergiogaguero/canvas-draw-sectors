import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) {
    }

    // regular route activation
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise(resolve => {
            if (this.authService.isUserLoggedIn()) {
                // if the user is logged in, check user's role for this url
                this.userService.getDetailUser(this.authService.getLoggedInUser()).subscribe(
                    account => {
                        this.authService.isRoleAuthorized(account[0].role.name, state.url)
                            .then(response => {
                                if (!response) {
                                    this.router.navigate(['/forbidden']);
                                }
                                resolve(response);
                            });
                    }, error => {
                        this.authService.clearCache();
                        this.authService.setRedirectUrl(state.url);
                        this.router.navigate([this.authService.getLoginUrl()]);
                        resolve(false);
                    });
            } else {
                // if you've reached this point, the user is not logged in!
                // redirect them and make sure you save the url they were trying to get to for improved UX
                this.authService.setRedirectUrl(state.url);
                this.router.navigate([this.authService.getLoginUrl()]);
                resolve(false);
            }
        });
    }
}
