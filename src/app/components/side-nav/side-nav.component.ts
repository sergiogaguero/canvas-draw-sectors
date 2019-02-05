import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Router, NavigationEnd } from '@angular/router';

// Servicios
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.scss'],
    host: {
        '(document:click)': 'onClick($event)',
    }
})

export class SideNavComponent implements OnInit {

    menuStatus = false;

    submenus = {
        reports: false,
        settings: false,
        operations: false
    };


    user: any;
    menuVisibility: any = {
        '/reports': false,
        '/reports/visitors': false,
        '/settings': false,
        '/settings/stores': false,
        '/settings/usuarios': false,
        '/settings/regions': false,
        '/settings/apis': false,
        '/settings/general': false,
        '/settings/status': false,
        '/settings/splash-page': false,
        '/salesforce': false,
        '/store-customer': false,
        '/store-operations': false,
        '/store-chain-operations': false,
        '/home': false
    };

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
        private _el: ElementRef
    ) { }

    ngOnInit() {
        this.router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                // get current user
                if (this.authService.isUserLoggedIn()) {
                    this.userService.getDetailUser(this.authService.getLoggedInUser()).subscribe(response => {
                        this.user = response[0];

                        // check what links the user can see from the menu
                        for (const menu in this.menuVisibility) {
                            if (menu) {
                                this.authService.isRoleAuthorized(this.user.role.name, menu).then(isAllowed => {
                                    this.menuVisibility[menu.toString()] = isAllowed;
                                });
                            }
                        }
                    },
                        error => {
                            this.authService.clearCache();
                            this.router.navigate([this.authService.getLoginUrl()]);
                        }
                    );
                }
            }
        });
    }

    onClick(event) {
        if (!this._el.nativeElement.contains(event.target)) {
            // similar checks
            this.closeMenu(300);
        }
    }

    isUserLoggedIn() {
        if (this.authService.isUserLoggedIn()) {
            return true;
        }
        return false;
    }

    switchSubMenu(subMenuKey: string) {
        return setTimeout(() => {
            this.menuStatus = true;

            for (const submenu in this.submenus) {
                if (submenu !== subMenuKey) {
                    this.submenus[submenu] = false;
                } else {
                    this.submenus[submenu] = !this.submenus[submenu];
                }
            }
        }, 200);
    }

    switchMenu(delay?: number) {
        if (!delay) {
            return false;
        }
        for (const submenu in this.submenus) {
            if (submenu) {
                this.submenus[submenu] = false;
            }
        }
        setTimeout(() => {
            this.menuStatus = !this.menuStatus;
        }
            , delay);
        return true;
    }

    closeMenu(delay?: number) {
        if (delay === undefined || delay == null) {
            this.setValues();
            return false;
        } else {
            this.setValues(delay);
            return true;
        }
    };

    logout() {
        this.authService.logout()
            .then((response) => {
                this.menuStatus = false;
                this.router.navigate([this.authService.getLoginUrl()]);
                this.clearCache();
            },
                error => {
                    console.error(error.statusText);
                });
    }

    clearCache() {
        this.authService.clearCache();
    };

    setValues(delay?: number) {
        for (const submenu in this.submenus) {
            if (submenu) {
                this.submenus[submenu] = false;
            }
        }
        setTimeout(() => {
            this.menuStatus = false;
        }
            , delay);
    };

}
