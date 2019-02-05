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
import { ConfigStatusComponent } from '../../components/config-status/config-status.component';

// service & stub :)
import { ProcessingStatusService } from 'app/services/processingStatus.service';
import { ProcessingStatusStub } from 'app/tests/stubs/processingStatus.service.stub';
import { CompaniesService } from 'app/services/companies.service';
import { CompaniesServiceStub } from 'app/tests/stubs/companies.service.stub';

// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { UnitSuffixPipe } from '../../pipes/unitSuffix.pipe';
import { AuthService } from '../../services/auth.service';
import { AuthServiceStub } from '../stubs/auth.service.stub';
import { StoresService } from '../../services/stores.service';
import { StoresServiceStub } from '../stubs/stores.service.stub';
import { UserService } from '../../services/user.service';
import { UserServiceStub } from '../stubs/user.service.stub';
import { Constants } from '../../classes/constants';
 

const translationsMock = {
    'config': {
        'status': {
            'title': 'Status',
            'store': 'Store',
            'qTickets': 'Quantity Tickets',
            'qVistors': 'Quantity Visitors'
        }
    }
};

class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
};

describe('ConfigStatusComponent ', () => {
    let comp: ConfigStatusComponent;
    let fixture: ComponentFixture<ConfigStatusComponent>;
    let _processingStatusService: ProcessingStatusService;
    let _companiesService: CompaniesService;
    let date = moment().format('YYYY-MM-DD');

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfigStatusComponent,
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
                CapitalizePipe,
                UnitSuffixPipe,
                { provide: ProcessingStatusService, useClass: ProcessingStatusStub },
                { provide: CompaniesService, useClass: CompaniesServiceStub }
            ]
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigStatusComponent);
        _processingStatusService = TestBed.get(ProcessingStatusService);
        _companiesService = TestBed.get(CompaniesService);

        comp = fixture.componentInstance; // test instance
    });

    describe('On ()', () => {
        it('should check if services was called', () => {
            spyOn(_processingStatusService, 'getStoresStatus')
                .and
                .returnValue(Observable.of([]));
            comp.getStores(date);
            expect(_processingStatusService.getStoresStatus).toHaveBeenCalled();
        });
    });

    describe('On getCompany', () => {
        it('should check if services was called', () => {
            spyOn(_companiesService, 'getCompanies')
            .and
            .returnValue(Observable.of([]));
            comp.getCompany();
            expect(_companiesService.getCompanies).toHaveBeenCalled();
        });
    });

});
