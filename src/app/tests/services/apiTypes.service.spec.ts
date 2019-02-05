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
import { ApiTypesService } from '../../services/apiTypes.service';
import { ApiType } from 'app/classes/apiType';
import { BaseURL } from 'app/classes/baseURL';

const baseURL = new BaseURL();
const apiURL = baseURL.getURL() + '/apiTypes';

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
] as ApiType[];

////////  Tests  /////////////
describe('ApiTypesService', () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApiTypesService]
        });
        injector = getTestBed();
        httpMock = TestBed.get(HttpTestingController);
    });

    it('can instantiate service when inject service',
        inject([ApiTypesService], (service: ApiTypesService) => {
            expect(service instanceof ApiTypesService).toBe(true);
        })
    );

    describe('when getApiTypes', () => {
        let fakeApiTypes: ApiType[];
        let apiTypesService: ApiTypesService;

        beforeEach(() => {
            fakeApiTypes = makeApiTypeData();
            apiTypesService = TestBed.get(ApiTypesService);
        });

        it('should have expected fake API types (Observable.do)', () => {
            apiTypesService.getApiTypes()
                .do(apiTypes => {
                    expect(apiTypes.length).toBe(fakeApiTypes.length,
                        'should have expected no. of apiTypes');
                });
        });

        it('should call the correct URL', () => {
            apiTypesService.getApiTypes().subscribe();
            httpMock.expectOne(apiURL).flush(fakeApiTypes);
            httpMock.verify();
        });
    });

});
