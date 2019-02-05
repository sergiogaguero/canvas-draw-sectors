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
import { CompaniesService } from '../../services/companies.service';
import { Company } from 'app/classes/company';
import { BaseURL } from 'app/classes/baseURL';

const baseURL = new BaseURL();
const apiURL = baseURL.getURL() + '/companies';

const makeCompanyData = () => [
    {
        companyId: 1,
        name: 'SuperRetailer',
        legalName: 'Super Retailer INC.'
    }
] as Company[];

////////  Tests  /////////////
describe('CompaniesService', () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CompaniesService]
        });
        injector = getTestBed();
        httpMock = TestBed.get(HttpTestingController);
    });

    it('can instantiate service when inject service',
        inject([CompaniesService], (service: CompaniesService) => {
            expect(service instanceof CompaniesService).toBe(true);
        }));

    describe('when getCompanies', () => {
        let fakeCompanies: Company[];
        let companiesService: CompaniesService;
        let getCompaniesFilter: string;

        beforeEach(() => {
            fakeCompanies = makeCompanyData();
            companiesService = TestBed.get(CompaniesService);
            getCompaniesFilter = '?filter={"include":"language"}';
        });

        it('should have expected fake companies (Observable.do)', () => {
            companiesService.getCompanies()
                .do(companies => {
                    expect(companies.length).toBe(fakeCompanies.length,
                        'should have expected no. of companies');
                });
        });

        it('should call the correct URL', () => {
            companiesService.getCompanies().subscribe();
            httpMock.expectOne(apiURL + getCompaniesFilter).flush(fakeCompanies);
            httpMock.verify();
        });
    });

});
