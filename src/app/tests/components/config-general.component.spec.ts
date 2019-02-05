// project basics
import { By, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MaterialModule } from '../../material.module';
import { DebugElement } from '@angular/core';

// Testing basics
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';

// component
import { ConfigGeneralComponent, SettingsConfirmationDialog } from '../../components/config-general/config-general.component';

// service & stub :)
import { SettingsService } from '../../services/settings.service';
import { SettingsServiceStub } from '../stubs/settings.service.stub';

import { Constants } from '../../classes/constants';
const GENERAL_SETTINGS = Constants.getGeneralSettings();

// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { MessageDialog } from '../../components/message-dialog/message-dialog.component';
const translationsMock = {
    'config': {
        'general': {
            'title': 'General',
            'passersBy': 'Passers-by',
            'knownPeriod': 'Period to evaluate known visitors',
            'ratio': 'Ratio',
            'devicesToDiscard': 'Amount of sightings to discarded a device',
            'visitorsDetail': 'Minimum dwell time per day to be considered visitor',
            'passersByDetail': 'Minimum dwell time per day to be considered passer-by (Note: the maximum is defined by the visitors value)',
            'knownPeriodDetail': 'Lapse of time to evaluate known visitors',
            'ratioDetail': 'Percentage to correct the deviation of number of visitors',
            'devicesToDiscardDetail': 'The amount of sightings required for a device to be discarded from visitor and passerby calculations.',
            'oneMonth': '1 Month',
            'threeMonths': '3 Months',
            'sixMonths': '6 Months',
            'twelveMonths': '12 Months',
            'all': 'All time',
            'sightings': 'sightings',
            'globalParameters': 'Global parameters',
            'devicesToDiscardTitle': 'Devices to be discarded',
            'meraki': 'Meraki',
            'dataWillBeUpdated': 'Changes to general settings will force us to adjust the maths behind the information we display. This will be automatically done overnight!',
            'updateNow': 'If you want us to update our calculations inmediately, please tick this checkbox:',
            'footnote': 'Note: All adjustments related to devices to be discarded will only affect sightings processed from today onwards.',
            'refreshNow': 'Update now',
            'refreshSuccessTitle': 'We\'re working on it!',
            'refreshSuccessMessage': 'The data is being updated with your new settings. This will take some time, so it\'s the perfect time for a coffee break.',
            'saveSuccessTitle': 'Settings saved!',
            'saveSuccessMessage': 'We\'ve saved your new system settings. You\'ll be able to see the information processed with these new settings tomorrow.'
        }
    },
    'general': {
        'warning': 'Warning',
        'minutes': 'minutes',
        'seconds': 'seconds'
    }
};
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}


describe('ConfigGeneralComponent ', () => {
    let comp: ConfigGeneralComponent;
    let fixture: ComponentFixture<ConfigGeneralComponent>;
    let de: DebugElement;
    let el: HTMLElement;
    let _settingsService: SettingsService;

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [
                ConfigGeneralComponent,
                SettingsConfirmationDialog,
                MessageDialog
            ], // declare the test component
            // entryComponents: [SettingsConfirmationDialog],
            imports: [
                MaterialModule,
                FormsModule,
                BrowserModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                })
            ], providers: [
                { provide: SettingsService, useClass: SettingsServiceStub },
            ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [
                    SettingsConfirmationDialog,
                    MessageDialog
                ]
            }
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigGeneralComponent);
        _settingsService = TestBed.get(SettingsService);

        comp = fixture.componentInstance; // test instance

        // query for the title <h1> by CSS element selector
        de = fixture.debugElement.query(By.css('#visitsTime .mat-slider'));
        el = de.nativeElement;
    });

    it('should have basic settings onInit', () => {
        _settingsService.getSettings().subscribe(settingsResponse => {
            const transformedResponse = settingsResponse;
            transformedResponse.visits = settingsResponse.visits / 60;
            transformedResponse.ratio = settingsResponse.ratio * 100;
            fixture.detectChanges();
            for (const setting in comp.settings) {
                if (comp.settings[setting] !== null) {
                    expect(comp.settings[setting]).toBe(transformedResponse[setting],
                        'Should have expected the correct number in the setting, has ' + comp.settings[setting]);
                }
            }
        });
    });

    it('should open the dialog when openSavingDialog()', () => {
        const dialogRef = comp.openSavingDialog();
        fixture.detectChanges();
        expect(dialogRef.componentInstance instanceof SettingsConfirmationDialog).toBe(true);
        expect(dialogRef.componentInstance.data.updateNow).toBe(false);
    });

    it('should save settings when call saveSettings()', () => {
        comp.settings = {
            settingId: 0,
            visits: 3,
            passByBegin: 200,
            passByEnd: 300,
            ratio: 0,
            knownPeriod: GENERAL_SETTINGS.KNOWN_VISITOR_PERIODS[1].dbValue,
            discarded: GENERAL_SETTINGS.DEVICE_DISCARD_SIGHTINGS[1]
        };
        const data = { updateNow: true };
        comp.saveSettings(data);
        fixture.detectChanges();
        _settingsService.getSettings().subscribe(settingsResponse => {
            const transformedResponse = settingsResponse;
            transformedResponse.visits = settingsResponse.visits / 60;
            transformedResponse.ratio = settingsResponse.ratio * 100;
            fixture.detectChanges();
            for (const setting in comp.settings) {
                if (comp.settings[setting] !== null) {

                    expect(comp.settings[setting]).toBe(transformedResponse[setting],
                        'Should have expected the correct number in the setting, has ' + comp.settings[setting]);
                }
            }
        });
    });
});
