// project basics
import { By, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MaterialModule } from '../../material.module';
import * as moment from 'moment';

// Testing basics
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

// component
import { SalesforceComponent } from '../../components/salesforce/salesforce.component';

// service & stub :)
import { KpisService } from '../../services/kpis.service';
import { KpisServiceStub } from '../stubs/kpis.service.stub';


// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { UnitSuffixPipe } from '../../pipes/unitSuffix.pipe';
import { AuthService } from '../../services/auth.service';
import { AuthServiceStub } from '../stubs/auth.service.stub';
import { RegionsService } from '../../services/regions.service';
import { RegionsServiceStub } from '../stubs/regions.service.stub';
import { StoresService } from '../../services/stores.service';
import { StoresServiceStub } from '../stubs/stores.service.stub';
import { UserService } from '../../services/user.service';
import { UserServiceStub } from '../stubs/user.service.stub';
import { Constants } from '../../classes/constants';
const translationsMock = {
    'salesforce': {
        'title': 'Sales force',
        'selectedPeriod': 'Selected period',
        'associate': 'Associate',
        'totals': 'Totals',
        'ticketAmount': 'Amount of tickets',
        'upt': 'UPT',
        'unitsPerTicket': 'Units per ticket',
        'averageTicket': 'Average ticket',
        'sales': 'Sales',
        'allRegions': 'All regions',
        'allStores': 'All stores',
        'startingDate': 'Starting date',
        'endingDate': 'Ending date',
        'noDataTitle': 'There\'s nothing to see',
        'noDataDetail': 'We haven\'t found any data for the date range you selected'
    },
    'errors': {
        'noRegionError': 'Hey, it seems like there\'s no regions around here. Without regions, we can\'t find any information to show you.',
        'noStoreError': 'Hey, it seems like there\'s no stores around here. Without stores, we can\'t find any information to show you.',
        'contactAdmin': 'Get in touch with an admin to make sure that they upload the information that we need.'
    }
};
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}


describe('SalesforceComponent ', () => {
    let comp: SalesforceComponent;
    let fixture: ComponentFixture<SalesforceComponent>;
    let _kpisService: KpisService;
    let _authService: AuthService;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SalesforceComponent,
                CapitalizePipe,
                UnitSuffixPipe
            ],
            imports: [
                MaterialModule,
                FormsModule,
                BrowserModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                })
            ], providers: [
                { provide: KpisService, useClass: KpisServiceStub },
                CapitalizePipe,
                UnitSuffixPipe,
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: RegionsService, useClass: RegionsServiceStub },
                { provide: StoresService, useClass: StoresServiceStub },
                { provide: UserService, useClass: UserServiceStub }
            ]
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SalesforceComponent);
        _kpisService = TestBed.get(KpisService);
        _authService = TestBed.get(AuthService);

        comp = fixture.componentInstance; // test instance
    });

    describe('on setCurrentDate()', () => {
        it('should set all dates correctly', () => {
            comp.setCurrentDate();
            const firstDayOfMonth = moment().startOf('month');
            const yesterday = moment().subtract(1, 'days').startOf('day');
            expect(comp.yesterday.format()).toBe(yesterday.format());
            expect(comp.periodEndingDate.format()).toBe(yesterday.format());
            expect(comp.periodStartingDate.format()).toBe(firstDayOfMonth.format());
        });
    });

    describe('onInit()', () => {
        it('should call some basic data-filling methods', () => {
            spyOn(comp, 'setCurrentDate');
            spyOn(comp, 'getUserRole');
            fixture.detectChanges();

            expect(comp.setCurrentDate).toHaveBeenCalled();
            expect(comp.getUserRole).toHaveBeenCalled();
        });
    });

    describe('on getUserRole()', () => {
        it('should bring the correct data for an admin', () => {
            spyOn(_kpisService, 'getSalesforceByTennant')
                .and
                .returnValue(Observable.of({ salesforce: [] }));
            _authService.login(Constants.roles.admin).subscribe(user => {
                comp.getUserRole();
                expect(comp.userRole).toBe(Constants.roles.admin);
                expect(_kpisService.getSalesforceByTennant).toHaveBeenCalled();

                fixture.detectChanges();
                expect(comp.dataSource.sort).toBe(comp.sort);
            });
        });

        it('should bring the correct data for a regional manager', () => {
            spyOn(_kpisService, 'getSalesforceByRegion')
                .and
                .returnValue(Observable.of({ salesforce: [] }));
            _authService.login(Constants.roles.regionMgr).subscribe(user => {
                comp.getUserRole();
                expect(comp.userRole).toBe(Constants.roles.regionMgr);
                expect(_kpisService.getSalesforceByRegion).toHaveBeenCalled();

                fixture.detectChanges();
                expect(comp.dataSource.sort).toBe(comp.sort);
            });
        });

        it('should bring the correct data for a store manager', () => {
            spyOn(_kpisService, 'getSalesforceByStore')
                .and
                .returnValue(Observable.of({ salesforce: [] }));
            _authService.login(Constants.roles.storeMgr).subscribe(user => {
                comp.getUserRole();
                expect(comp.userRole).toBe(Constants.roles.storeMgr);
                expect(_kpisService.getSalesforceByStore).toHaveBeenCalled();

                fixture.detectChanges();
                expect(comp.dataSource.sort).toBe(comp.sort);
            });
        });


    });

});
