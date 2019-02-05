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
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import * as moment from 'moment';

// services
import { KpisService } from '../../services/kpis.service';
import { Moment } from 'moment';

import { environment as env } from '../../../environments/environment';

const baseURL = `http://${env.host}:${env.port}/api/KPIs`;

function makeKpisData() {
    return {
        visits: 0,
        dwellTime: 0,
        averageTicket: 0,
        conversion: 0,
        behaviour: {
            visits: 0,
            dwellTime: 0,
            averageTicket: 0,
            conversion: 0
        }
    };
}

function makeSalesforceKpis() {
    return {
        sales: 0,
        upt: 0,
        qTickets: 0,
        averageTicket: 0,
        salesforce: [
            {
                associate: {
                    firstname: '',
                    lastname: '',
                    idinCustomerDB: '',
                    accountId: ''
                },
                averageTicket: 0,
                qTickets: 0,
                sales: 0,
                storeName: '',
                upt: 0
            }
        ]
    };
}

function makeCockpit() {
    return {
        captacion: 0,
        fidelidad: 0,
        conversion: 0
    };
}

function makeChainOperations() {
    return {
        sales: {
            total: 0,
            stores: [
                {
                    nombre: '',
                    region: '',
                    percentage: 0,
                    amount: 0,
                    position: 0
                },
                {
                    nombre: '',
                    region: '',
                    percentage: 0,
                    amount: 0,
                    position: 0
                }
            ]
        },
        ticketProm: {
            total: 0,
            stores: [
                {
                    nombre: '',
                    region: '',
                    amount: 0,
                    position: 0
                },
                {
                    nombre: '',
                    region: '',
                    amount: 0,
                    position: 0
                }
            ]
        },
        upt: {
            total: 0,
            stores: [
                {
                    nombre: '',
                    region: '',
                    amount: 0,
                    position: 0
                },
                {
                    nombre: '',
                    region: '',
                    qty: 0,
                    position: 0
                }
            ]
        }
    };
}

////////  Tests  /////////////
describe('KpisHomeStoreMgrService', () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;
    let _kpisService: KpisService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [KpisService]
        });
        injector = getTestBed();
        httpMock = TestBed.get(HttpTestingController);
        _kpisService = TestBed.get(KpisService);
    });

    it('can instantiate service when inject service',
        inject([KpisService], (service: KpisService) => {
            expect(service instanceof KpisService).toBe(true);
        }));

    describe('when getKpis', () => {
        let fakeKpis: any;
        let date: string;
        let newDate: Date;
        let storeId: number;

        beforeEach(() => {
            newDate = new Date();
            date = newDate.toString();
            storeId = 1;
            fakeKpis = makeKpisData();
        });

        it('should have expected fake kpis (Observable.do)', () => {
            _kpisService.getKpis(storeId, date)
                .do(kpis => {
                    expect(kpis).toBe(!null),
                        ('should have expected no. of maps');
                });
        });

    });

    describe('when getSalesforce', () => {
        let fakeKpis: any;
        let startingDate: Moment;
        let endingDate: Moment;
        let storeId: number;
        let regionId: number;

        beforeEach(() => {
            startingDate = moment();
            endingDate = moment();
            storeId = 1;
            regionId = 1;
            fakeKpis = makeSalesforceKpis();
        });

        it('should have expected fake kpis (Observable.do)', () => {
            _kpisService.getSalesforceByTennant(startingDate, endingDate)
                .do(kpis => {
                    expect(kpis).toBe(!null),
                        ('should have expected no. of maps');
                });
        });

        it('should have expected fake kpis (Observable.do)', () => {
            _kpisService.getSalesforceByRegion(regionId, startingDate, endingDate)
                .do(kpis => {
                    expect(kpis).toBe(!null),
                        ('should have expected no. of maps');
                });
        });

        it('should have expected fake kpis (Observable.do)', () => {
            _kpisService.getSalesforceByStore(storeId, startingDate, endingDate)
                .do(kpis => {
                    expect(kpis).toBe(!null),
                        ('should have expected no. of maps');
                });
        });

    });

    describe('when getCockPit', () => {
        let params: any;
        let fakeKpis: any;

        beforeEach(() => {
            params = {
                startDate: moment().format('YYYY-MM-DD'),
                endDate: moment().format('YYYY-MM-DD'),
                regionId: 1,
                storeId: 1
            };
            fakeKpis = makeCockpit();
            _kpisService = injector.get(KpisService);
        });

        it('should call to /KPIs/cockpit endpoint with urlParams', () => {
            _kpisService.getCockPit(params).subscribe();
            const urlParams = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
            httpMock.expectOne(`${baseURL}/cockpit?${urlParams}`).flush(fakeKpis);
            httpMock.verify();
        });

        it(`should have expected fake kpis`, () => {
            _kpisService.getCockPit(params)
                .subscribe(kpis => {
                    expect(kpis).toBeDefined(),
                        ('should have expected kpis');
                    expect(kpis),
                        ('should have expected kpis');
                });
            const urlParams = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
            httpMock.expectOne(`${baseURL}/cockpit?${urlParams}`).flush(fakeKpis);
            httpMock.verify();
        });

    });

    describe('when getKpisChainOperations', () => {
        let params: any;
        let fakeKpis: any;

        beforeEach(() => {
            params = {
                regionId: 1,
                startingDate: moment().format('YYYY-MM-DD'),
                endingDate: moment().format('YYYY-MM-DD')
            };
            fakeKpis = makeChainOperations();
        });

        it('should call to /KPIs/storeChainOperations endpoint with urlParams', () => {
            _kpisService.getKpisChainOperations(params).subscribe();
            const urlParams = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
            httpMock.expectOne(`${baseURL}/storeChainOperations?${urlParams}`).flush(fakeKpis);
            httpMock.verify();
        });

        it(`should have expected fake kpis`, () => {
            _kpisService.getKpisChainOperations(params)
                .subscribe(kpis => {
                    expect(kpis).toBeDefined(),
                        ('should have expected kpis');
                    expect(kpis),
                        ('should have expected kpis');
                });
            const urlParams = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
            httpMock.expectOne(`${baseURL}/storeChainOperations?${urlParams}`).flush(fakeKpis);
            httpMock.verify();
        });

    });

    describe('on getVisitors()', () => {
        let year;
        let month;
        let optionalParams: any;

        beforeEach(() => {
            year = '2018';
            month = '03';
            optionalParams = {
                storeMgr: { storeManager: 1 },
                regionMgr: { regionManager: 1 },
                regionId: { regionId: 1 }
            };
        });
        it('should call the correct URL with no extra parameters', () => {
            _kpisService.getVisitors(year, month).subscribe();
            httpMock.expectOne(_kpisService.urlBase + `/visitors?year=${year}&month=${month}`).flush([]);
            httpMock.verify();
        });

        it('should call the correct URL with a store manager id', () => {
            _kpisService.getVisitors(year, month, optionalParams.storeMgr).subscribe();
            httpMock.expectOne(
                _kpisService.urlBase +
                `/visitors?year=${year}&month=${month}&storeManager=${optionalParams.storeMgr.storeManager}`
            ).flush([]);
            httpMock.verify();
        });

        it('should call the correct URL with a region manager id', () => {
            _kpisService.getVisitors(year, month, optionalParams.regionMgr).subscribe();
            httpMock.expectOne(
                _kpisService.urlBase +
                `/visitors?year=${year}&month=${month}&regionManager=${optionalParams.regionMgr.regionManager}`
            ).flush([]);
            httpMock.verify();
        });

        it('should call the correct URL with a region id', () => {
            _kpisService.getVisitors(year, month, optionalParams.regionId).subscribe();
            httpMock.expectOne(
                _kpisService.urlBase +
                `/visitors?year=${year}&month=${month}&regionId=${optionalParams.regionId.regionId}`
            ).flush([]);
            httpMock.verify();
        });
    });

});
