// basic for testing
import { inject, TestBed, getTestBed } from '@angular/core/testing';

// basic for testing services
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

// services
import { ProcessingStatusService } from '../../services/processingStatus.service';
import { Constants } from '../../classes/constants';
import { Moment } from 'moment';

const Stores = () => [
    {
        name: 'tienda 1',
        qtickets: 1,
        qvisitors: 1,
        store_id: 1
    },
    {
        name: 'tienda 2',
        qtickets: 2,
        qvisitors: 2,
        store_id: 2
    },
    {
        name: 'tienda 3',
        qtickets: 3,
        qvisitors: 3,
        store_id: 3
    }
] as any[];

describe('ProcessingStatusService', () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;
    let url: string;
    let _processingStatusService: ProcessingStatusService;
    let fakeStores: any[];
    let date: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                ProcessingStatusService
            ]
        });
        injector = getTestBed();
        httpMock = TestBed.get(HttpTestingController);
        _processingStatusService = TestBed.get(ProcessingStatusService);
        url = _processingStatusService.statusUrl;
        fakeStores = Stores();
        date = moment().format('YYYY-MM-DD')
    });

    it('can instatiate service when inject service',
        inject([ProcessingStatusService], (service: ProcessingStatusService) => {
            expect(service instanceof ProcessingStatusService).toBeTruthy();
        })
    );

    it('should call the correct URL on getStoresStatus()', () => {
        _processingStatusService.getStoresStatus(date).subscribe();
        httpMock.expectOne(url + '?date=' + date).flush(fakeStores);
        httpMock.verify();
    });
});
