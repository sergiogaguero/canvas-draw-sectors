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
import { SettingsService } from '../../services/settings.service';
import { BaseURL } from 'app/classes/baseURL';

const baseURL = new BaseURL();
const apiURL = baseURL.getURL() + '/settings';

const makeSettingsData = () => [
    {
        settingId: 1,
        visits: 8,
        passByBegin: 2,
        passByEnd: 8,
        knownPeriod: '6 Month',
        discarded: 180
    }
] as any[];

////////  Tests  /////////////
describe('SettingsService', () => {
    let httpMock: HttpTestingController;
    
    let fakeSettings: any[];
    
    let settingsService: SettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SettingsService]
        });
        httpMock = TestBed.get(HttpTestingController);
        
        fakeSettings = makeSettingsData();
        settingsService = TestBed.get(SettingsService);
    });

    it('can instantiate service when inject service',
        inject([SettingsService], (service: SettingsService) => {
            expect(service instanceof SettingsService).toBe(true);
        }));

    describe('when getSettings', () => {

        it('should have expected fake settings (Observable.do)', () => {
            settingsService.getSettings()
                .do(settings => {
                    expect(settings).toBe(!null,
                        'should not be null');
                });
        });

        it('should call the correct URL', () => {
            settingsService.getSettings().subscribe();
            httpMock.expectOne(apiURL).flush(fakeSettings);
            httpMock.verify();
        });
    });

    describe('when editSettings', () => {
        let settingId: number;
        const editedSetting = {
            settingId: 1,
            visits: 2,
            passByBegin: 2,
            passByEnd: 8,
            knownPeriod: '6 Month',
            discarded: 180
        };

        beforeEach(() => {
            settingId = 1;
        });

        it('should have expected to edit the setting (Observable.do)', () => {
            settingsService.editSettings(editedSetting)
                .do(settings => {
                    expect(settings).toBe(fakeSettings[0],
                        'should be the setting with id 1');
                });
        });

        it('should call the correct URL', () => {
            settingsService.editSettings(editedSetting).subscribe();
            httpMock.expectOne(apiURL + '/' + editedSetting.settingId).flush(fakeSettings);
            httpMock.verify();
        });
    });

    it('should call the correct url on updateViews()', () => {
        const filter = '/updateViews';
        settingsService.updateViews().subscribe();
        httpMock.expectOne(apiURL + filter).flush(fakeSettings);
        httpMock.verify();
    });

});
