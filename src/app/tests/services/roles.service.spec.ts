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
import { RolesService } from '../../services/roles.service';
import { Role } from 'app/classes/role';
import { BaseURL } from 'app/classes/baseURL';

const baseURL = new BaseURL();
const apiURL = baseURL.getURL() + '/roles';

const makeRolesData = () => [
    {
        roleId: 1,
        name: 'Admin'
    },
    {
        roleId: 2,
        name: 'Gte Red'
    },
    {
        roleId: 3,
        name: 'Gte Tienda'
    }
] as Role[];

////////  Tests  /////////////
describe('RolesService', () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RolesService]
        });
        injector = getTestBed();
        httpMock = TestBed.get(HttpTestingController);
    });

    it('can instantiate service when inject service',
        inject([RolesService], (service: RolesService) => {
            expect(service instanceof RolesService).toBe(true);
        }));

    describe('when getRoles', () => {
        let fakeRoles: Role[];
        let rolesService: RolesService;

        beforeEach(() => {
            fakeRoles = makeRolesData();
            rolesService = TestBed.get(RolesService);
        });

        it('should have expected fake roles (Observable.do)', () => {
            rolesService.getRoles()
                .do(languages => {
                    expect(languages.length).toBe(fakeRoles.length,
                        'should have expected no. of roles');
                });
        });

        it('should call the correct URL', () => {
            rolesService.getRoles().subscribe();
            httpMock.expectOne(apiURL).flush(fakeRoles);
            httpMock.verify();
        });
    });

});
