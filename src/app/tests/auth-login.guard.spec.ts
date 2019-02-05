// basic for testing
import {
    inject, TestBed, getTestBed
} from '@angular/core/testing';
// basic for testing services
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { Observable } from 'rxjs/Observable';
import { AuthGuardLogin } from '../guards/auth-login.guard';
import { RouterTestingModule } from '@angular/router/testing';


class MockRouter {
    navigateByUrl(url: string) { return url; }
}


////////  Tests  /////////////
describe('AuthLoginGuard', () => {
    let _authGuardLogin: AuthGuardLogin;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                AuthGuardLogin,
                { provide: RouterTestingModule, useClass: MockRouter }
            ]
        });

        _authGuardLogin = TestBed.get(AuthGuardLogin);
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
    });

    it('can access if no one\'s logged in',
        () => {
            expect(_authGuardLogin.canActivate())
                .toBeTruthy('Should be able to access if there is no info on storages');
        }
    );

    it('can not access if someone is logged in on localstorage',
        () => {
            localStorage.setItem('currentUser', JSON.stringify({
                'tenantId': 1,
                'id': 'ysk4HULnS29heRTmgqlH25sgyjmMDsJqQvNCKkFcj4lFifnxwTjEFQjmmppxsKHi',
                'ttl': 1209600,
                'created': new Date(),
                'userId': 1
            }));
            expect(_authGuardLogin.canActivate())
                .toBeFalsy('Should not be able to access if there is info on localstorage');
        }
    );

    it('can not access if someone is logged in on sessionstorage',
        () => {
            sessionStorage.setItem('currentUser', JSON.stringify({
                'tenantId': 1,
                'id': 'ysk4HULnS29heRTmgqlH25sgyjmMDsJqQvNCKkFcj4lFifnxwTjEFQjmmppxsKHi',
                'ttl': 1209600,
                'created': new Date(),
                'userId': 1
            }));
            expect(_authGuardLogin.canActivate())
                .toBeFalsy('Should not be able to access if there is info on sessionstorage');
        }
    );


});
