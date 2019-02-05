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
import { LanguagesService } from '../../services/languages.service';
import { Language } from 'app/classes/language';
import { BaseURL } from 'app/classes/baseURL';

const baseURL = new BaseURL();
const apiURL = baseURL.getURL() + '/languages';

const makeLanguagesData = () => [
    {
        langId: 1,
        name: 'English',
        key: 'en'
    },
    {
        langId: 2,
        name: 'Español',
        key: 'es'
    },
    {
        langId: 3,
        name: 'Portugés',
        key: 'pt'
    }
] as Language[];

////////  Tests  /////////////
describe('LanguagesService', () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LanguagesService]
        });
        injector = getTestBed();
        httpMock = TestBed.get(HttpTestingController);
    });

    it('can instantiate service when inject service',
        inject([LanguagesService], (service: LanguagesService) => {
            expect(service instanceof LanguagesService).toBe(true);
        }));

    describe('when getLanguages', () => {
        let fakeLanguages: Language[];
        let languagesService: LanguagesService;

        beforeEach(() => {
            fakeLanguages = makeLanguagesData();
            languagesService = TestBed.get(LanguagesService);
        });

        it('should have expected fake languages (Observable.do)', () => {
            languagesService.getLanguages()
                .do(languages => {
                    expect(languages.length).toBe(fakeLanguages.length,
                        'should have expected no. of languages');
                });
        });

        it('should call the correct URL', () => {
            languagesService.getLanguages().subscribe();
            httpMock.expectOne(apiURL).flush(fakeLanguages);
            httpMock.verify();
        });
    });

});
