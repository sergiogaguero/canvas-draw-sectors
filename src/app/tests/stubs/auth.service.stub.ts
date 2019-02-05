import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Constants } from '../../classes/constants';

export class AuthServiceStub {
    redirectUrl = '';
    isLoggedIn = false;
    loggedInUser = null;
    loginUrl = '/login';
    permissions = [
        {
            'role': 'Admin',
            'routes': [
                '/confirmar',
                '/reestablecer',
                '/restaurar',
                '/login',
                '/store-operations',
                '/salesforce',
                '/store-customer',
                '/reportes',
                '/reportes/rendimientoRed',
                '/settings',
                '/settings/stores',
                '/settings/stores/add',
                '/settings/stores/:id',
                '/settings/stores/:id/floors/:id',
                '/settings/regions',
                '/settings/usuarios',
                '/settings/apis',
                '/settings/general',
                '/globalUsers/id'
            ]
        },
        {
            'role': 'GteTienda',
            'routes': [
                '/confirmar',
                '/reestablecer',
                '/restaurar',
                '/login',
                '/salesforce',
                '/reportes',
                '/reportes/rendimientoRed',
                '/store-operations',
                '/store-customer'
            ]
        },
        {
            'role': 'GteRed',
            'routes': [
                '/confirmar',
                '/reestablecer',
                '/restaurar',
                '/login',
                '/store-customer',
                '/reportes',
                '/reportes/rendimientoRed',
                '/salesforce',
                '/store-operations'
            ]
        },
        {
            'role': 'Vendedor',
            'routes': [
                '/store-operations'
            ]
        }
    ];

    login(user: any): Observable<any> {
        switch (user) {
            case Constants.roles.admin:
                this.loggedInUser = 1;
                break;
            case Constants.roles.regionMgr:
                this.loggedInUser = 2;
                break;
            case Constants.roles.storeMgr:
                this.loggedInUser = 3;
                break;
            case Constants.roles.associate:
                this.loggedInUser = 4;
                break;
        }


        this.isLoggedIn = true;
        if (this.loggedInUser == null) {
            this.loggedInUser = 1;
        }

        return Observable.of({
            'tenantId': 1,
            'id': 'ysk4HULnS29heRTmgqlH25sgyjmMDsJqQvNCKkFcj4lFifnxwTjEFQjmmppxsKHi',
            'ttl': 1209600,
            'created': new Date(),
            'userId': this.loggedInUser
        });

    }

    loginByUser(userId: number): Observable<any> {
        this.isLoggedIn = true;
        this.loggedInUser = userId;

        return Observable.of({
            'tenantId': 1,
            'id': 'ysk4HULnS29heRTmgqlH25sgyjmMDsJqQvNCKkFcj4lFifnxwTjEFQjmmppxsKHi',
            'ttl': 1209600,
            'created': new Date(),
            'userId': this.loggedInUser
        });

    }

    logout() {
        this.isLoggedIn = false;
        this.loggedInUser = null;
        return Observable.of(null).toPromise();
    }

    getRedirectUrl(): string {
        return this.redirectUrl;
    }

    isUserLoggedIn(): boolean {
        return this.isLoggedIn;
    }

    getLoggedInUser(): number {
        return this.loggedInUser;
    }

    getPermissionsByRole(role: string): Promise<any> {
        return Observable.of(this.permissions.filter(p => p.role === role)[0]).toPromise();
    }

    clearCache() {

    }

    isRoleAuthorized(role: string, url: string) {
        // get the routes that this role is allowed to access
        return this.getPermissionsByRole(role).then(response => {
            // for each route, split them into their components
            for (const route in response.routes) {
                if (response.routes[route]) {
                    const splitRoute = response.routes[route].split('/');
                    const splitUrl = url.split('/');

                    // try to match the desired route's components with the available route's components
                    for (const i in splitRoute) {
                        // if the components in the route don't match, and the component is not a parameter, just stop trying
                        if (splitRoute[i] !== splitUrl[i] && splitRoute[i].indexOf(':') !== 0) {
                            break;
                        } else if ((parseInt(i) + 1) === splitRoute.length && splitRoute.length === splitUrl.length) {
                            // if there were no problems and you're at the end of the routes and they have the same length, this is the one!
                            return true;
                        }
                    }
                }
            }
            return false;
        }, error => {
            return false;
        });
    }

    responseGetPermissionsByRole(response) {

    }

    setRedirectUrl(url: string): void {
        this.redirectUrl = url;
    }

    getLoginUrl(): string {
        return this.loginUrl;
    }
}
