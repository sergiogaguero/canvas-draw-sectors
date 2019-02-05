// basic for testing
import {
    TestBed, getTestBed, inject
} from '@angular/core/testing';
// basic for testing services
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { Observable } from 'rxjs/Observable';

// services
import { AuthService } from '../../services/auth.service';
import { Constants } from '../../classes/constants';


const makeApiTypeData = () => [
    {
        id: 1,
        label: 'sales',
        description: 'POS API'
    },
    {
        id: 2,
        label: 'associates',
        description: 'Employees API'
    }
] as any[];

////////  Tests  /////////////
describe('AuthService', () => {
    let httpMock: HttpTestingController;
    let _authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });
        httpMock = TestBed.get(HttpTestingController);
        _authService = TestBed.get(AuthService);
    });

    it('can instantiate service when inject service',
        inject([AuthService], (service: AuthService) => {
            expect(service instanceof AuthService).toBe(true);
        })
    );

    it('should return the redirectURL on getRedirectUrl()', () => {
        const result = _authService.redirectUrl;
        expect(_authService.getRedirectUrl()).toBe(result);
    });

    it('should change the redirectURL on setRedirectUrl()', () => {
        _authService.setRedirectUrl('bananas');
        expect(_authService.redirectUrl).toBe('bananas');
    });

    it('should return the loginURL on getLoginUrl()', () => {
        const result = _authService.loginUrl;
        expect(_authService.getLoginUrl()).toBe(result);
    });

    describe('on isUserLoggedIn()', () => {
        beforeEach(() => {
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
        });

        it('should return false when there\'s nothing in the local/session storage', () => {
            expect(_authService.isUserLoggedIn())
                .toBeFalsy('THERE\'S NOTHING IN THE CACHE HOW DID YOU EVEN GET THIS ERROR');
        });

        it('should return true when there\'s something in the local storage', () => {
            localStorage.setItem('currentUser', JSON.stringify({
                'tenantId': 1,
                'id': 'ysk4HULnS29heRTmgqlH25sgyjmMDsJqQvNCKkFcj4lFifnxwTjEFQjmmppxsKHi',
                'ttl': 1209600,
                'created': new Date(),
                'userId': 1
            }));
            expect(_authService.isUserLoggedIn())
                .toBeTruthy('wtf man how did you even get this');
        });

        it('should return true when there\'s something in the session storage', () => {
            sessionStorage.setItem('currentUser', JSON.stringify({
                'tenantId': 1,
                'id': 'ysk4HULnS29heRTmgqlH25sgyjmMDsJqQvNCKkFcj4lFifnxwTjEFQjmmppxsKHi',
                'ttl': 1209600,
                'created': new Date(),
                'userId': 1
            }));
            expect(_authService.isUserLoggedIn())
                .toBeTruthy('wtf man how did you even get this');
        });
    });

    describe('on getLoggedInUser()', () => {
        beforeEach(() => {
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
        });

        it('should return null when there\'s nothing in the local/session storage', () => {
            expect(_authService.getLoggedInUser())
                .toBeNull('THERE\'S NOTHING IN THE CACHE HOW DID YOU EVEN GET THIS ERROR');
        });

        it('should return the user id when there\'s something in the local storage', () => {
            const userId = 1;
            localStorage.setItem('currentUser', JSON.stringify({
                'tenantId': 1,
                'id': 'ysk4HULnS29heRTmgqlH25sgyjmMDsJqQvNCKkFcj4lFifnxwTjEFQjmmppxsKHi',
                'ttl': 1209600,
                'created': new Date(),
                'userId': userId
            }));
            expect(_authService.getLoggedInUser())
                .toBe(userId, 'wtf man how did you even get this');
        });

        it('should return true when there\'s something in the session storage', () => {
            const userId = 1;
            sessionStorage.setItem('currentUser', JSON.stringify({
                'tenantId': 1,
                'id': 'ysk4HULnS29heRTmgqlH25sgyjmMDsJqQvNCKkFcj4lFifnxwTjEFQjmmppxsKHi',
                'ttl': 1209600,
                'created': new Date(),
                'userId': userId
            }));
            expect(_authService.getLoggedInUser())
                .toBe(userId, 'wtf man how did you even get this');
        });
    });

    it('should call the correct URL on getPermissions()', () => {
        _authService.getPermissions().subscribe();
        httpMock.expectOne(_authService.permissionsUrl).flush([]);
        httpMock.verify();
    });

    it('should call the correct URL on getPermissionsByRole()', () => {
        _authService.getPermissionsByRole(Constants.roles.admin);
        httpMock.expectOne(_authService.permissionsUrl).flush([]);
        httpMock.verify();
    });

    it('should call the correct URL on login()', () => {
        _authService.login({
            email: 'something',
            password: 'something'
        }).subscribe();
        httpMock.expectOne(_authService.apiUrl + '/globalUsers/login').flush([]);
        httpMock.verify();
    });

    it('should call the correct URL on logout()', () => {
        _authService.logout();
        httpMock.expectOne(_authService.apiUrl + '/globalUsers/logout').flush([]);
        httpMock.verify();
    });

    it('should clear the storages on clearCache()', () => {
        sessionStorage.setItem('currentUser', JSON.stringify({
            'tenantId': 1,
            'id': 'ysk4HULnS29heRTmgqlH25sgyjmMDsJqQvNCKkFcj4lFifnxwTjEFQjmmppxsKHi',
            'ttl': 1209600,
            'created': new Date(),
            'userId': 1
        }));
        localStorage.setItem('currentUser', JSON.stringify({
            'tenantId': 1,
            'id': 'ysk4HULnS29heRTmgqlH25sgyjmMDsJqQvNCKkFcj4lFifnxwTjEFQjmmppxsKHi',
            'ttl': 1209600,
            'created': new Date(),
            'userId': 1
        }));
        _authService.clearCache();
        expect(localStorage.getItem('currentUser')).toBeNull();
        expect(sessionStorage.getItem('currentUser')).toBeNull();
    });

});
