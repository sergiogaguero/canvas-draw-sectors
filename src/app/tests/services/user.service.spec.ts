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

// services
import { UserService } from '../../services/user.service';
import { Constants } from '../../classes/constants';
import { AuthService } from '../../services/auth.service';
import { AuthServiceStub } from '../stubs/auth.service.stub';
import { RouterTestingModule } from '@angular/router/testing';

const makeUserData = () => [
    {
        'accountId': 1,
        'userId': 1,
        'name': 'Sergo',
        'lastname': 'Aguero',
        'roleId': 1,
        'timezone': '2017-08-29T12:12:31.949Z',
        'user': {
            'userId': 1,
            'tenantId': 1,
            'email': 'ocpqa@grupoassa.com',
            'emailVerified': true,
            'langId': 1
        },
        'role': {
            'roleId': 1,
            'name': 'Admin'
        }
    },
    {
        'accountId': 2,
        'userId': 2,
        'name': 'Javier',
        'lastname': 'Coppis',
        'roleId': 3,
        'timezone': null,
        'user': {
            'userId': 47,
            'tenantId': 2,
            'email': 'j@grupoassa.com',
            'emailVerified': true,
            'langId': 1
        },
        'role': {
            'roleId': 3,
            'name': 'GteRed'
        }
    },
    {
        'accountId': 3,
        'userId': 3,
        'name': 'Javier',
        'lastname': 'Coppis',
        'roleId': 2,
        'timezone': null,
        'user': {
            'userId': 47,
            'tenantId': 2,
            'email': 'j@grupoassa.com',
            'emailVerified': true,
            'langId': 1
        },
        'role': {
            'roleId': 2,
            'name': 'GteTienda'
        }
    },
    {
        'accountId': 4,
        'userId': 4,
        'name': 'Javier',
        'lastname': 'Coppis',
        'roleId': 3,
        'timezone': null,
        'user': {
            'userId': 47,
            'tenantId': 2,
            'email': 'j@grupoassa.com',
            'emailVerified': true,
            'langId': 1
        },
        'role': {
            'roleId': 4,
            'name': 'Vendedor'
        }
    }
] as any[];

////////  Tests  /////////////
describe('UserService', () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;
    let url: string;
    let _userService: UserService;
    let fakeAccounts: any[];

    beforeEach(() => {  
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                UserService,
                { provide: AuthService, useClass: AuthServiceStub },
                RouterTestingModule
            ]
        });
        injector = getTestBed();
        httpMock = TestBed.get(HttpTestingController);
        _userService = TestBed.get(UserService);
        url = _userService.accountsUrl;
        fakeAccounts = makeUserData();
    });

    it('can instantiate service when inject service',
        inject([UserService], (service: UserService) => {
            expect(service instanceof UserService).toBe(true);
        })
    );

    it('should call the correct URL on getDetailUser()', () => {
        const filter = '/getDetail'
        _userService.getDetailUser().subscribe();
        httpMock.expectOne(url + filter).flush(fakeAccounts[0]);
        httpMock.verify();
    });

    it('should call the correct URL on createUser()', () => {
        _userService.createUser(fakeAccounts[0]).subscribe();
        httpMock.expectOne(url).flush(fakeAccounts[0]);
        httpMock.verify();
    });

    it('should call the correct URL on deleteUser()', () => {
        _userService.deleteUser(fakeAccounts[0].accountId).then();
        httpMock.expectOne(url + '/' + fakeAccounts[0].accountId).flush(fakeAccounts[0]);
        httpMock.verify();
    });

    it('should call the correct URL on getUsers()', () => {
        const filter = '?filter={"include":["user","role", "salesAssociate"]}'
        _userService.getUsers().subscribe();
        httpMock.expectOne(url + filter).flush(fakeAccounts[0]);
        httpMock.verify();
    });

    it('should call the correct URL on updateUser()', () => {
        _userService.updateUser(fakeAccounts[0], fakeAccounts[0].accountId).then();
        httpMock.expectOne(url + '/' + fakeAccounts[0].accountId).flush(fakeAccounts[0]);
        httpMock.verify();
    });

    it('should call the correct URL on updatelanguageUser()', () => {
        _userService.updatelanguageUser(fakeAccounts[0].userId, 1).then();
        httpMock.expectOne(_userService.api + '/globalUsers/' + fakeAccounts[0].userId).flush(fakeAccounts[0]);
        httpMock.verify();
    });

    it('should call the correct URL on requestPassword()', () => {
        const email = 'e@mail.com';
        const filter = '/globalUsers/requestPassword?email=' + email;
        _userService.requestPassword(email).then();
        httpMock.expectOne(_userService.api + filter).flush(fakeAccounts[0]);
        httpMock.verify();
    });

    it('should call the correct URL on resetPassword()', () => {
        const password = 'superStrongPassword';
        const filter = '/globalUsers/reset-password';
        _userService.resetPassword(password, 'this is totally a token').then();
        httpMock.expectOne(_userService.api + filter).flush(fakeAccounts[0]);
        httpMock.verify();
    });

    it('should call the correct URL on confirmAccount()', () => {
        const uid = 'this is the uid';
        const token = 'this is totally a token'
        const filter = '/globalUsers/confirm?uid=' + uid + '&token=' + token;
        _userService.confirmAccount(uid, token).then();
        httpMock.expectOne(_userService.api + filter).flush(fakeAccounts[0]);
        httpMock.verify();
    });
});
