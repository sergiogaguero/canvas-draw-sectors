// Testing basics
import { ComponentFixture, TestBed, inject, getTestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';
import { By, BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { MaterialModule } from '../../material.module';

import * as moment from 'moment';
import * as locales from 'moment/min/locales';
// Components
import { HeaderComponent } from '../../components/header/header.component';
// Translations
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';

// services
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { LanguagesService } from '../../services/languages.service';
import { CompaniesService } from '../../services/companies.service';
import { LanguagesServiceStub } from '../stubs/languages.service.stub';
import { AuthServiceStub } from '../stubs/auth.service.stub';
import { UserServiceStub } from '../stubs/user.service.stub';
import { CompaniesServiceStub } from '../stubs/companies.service.stub';
import { Company } from 'app/classes/company';

import { Constants } from '../../classes/constants';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, NavigationEnd } from '@angular/router';



const translationsMock = {
    "side-nav": {
        "operations": "Operaciones",
        "configuration": "Configuración",
        "logout": "Logout"
    }
}
const makeCompanyData = () => [
    {
        companyId: 1,
        name: 'SuperRetailer',
        legalName: 'Super Retailer INC.',
        language: {
            key: 'ES'
        }
    }
] as Company[];

class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}


class MockRouter {
    public ne = new NavigationEnd(0, 'http://localhost:4200/login', 'http://localhost:4200/login');
    public events = new Observable(observer => {
        observer.next(this.ne);
        observer.complete();
    });

    navigate(url: string) { return url; }
}

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let _authService: AuthServiceStub;
    let _userService: UserService;
    let _companiesService: CompaniesServiceStub;
    let _languageService: LanguagesServiceStub;



    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule,
                NoopAnimationsModule,
                MaterialModule,
                RouterTestingModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader, useClass: FakeLoader
                    },
                }),
            ],
            providers: [
                { provide: LanguagesService, useClass: LanguagesServiceStub },
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: Router, useClass: MockRouter },
                { provide: UserService, useClass: UserServiceStub },
                { provide: CompaniesService, useClass: CompaniesServiceStub },
            ],
            declarations: [
                HeaderComponent
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(HeaderComponent);
            _authService = TestBed.get(AuthService);
            _userService = TestBed.get(UserService);
            _companiesService = TestBed.get(CompaniesService);
            _languageService = TestBed.get(LanguagesService);
            component = fixture.debugElement.componentInstance;
        })
    }));

        /* commenting this because of ngAfterViewCheck

    describe('test onInit()', () => {

        it('check onInit(), using user language', () => {
            _companiesService.companies = makeCompanyData();
            spyOn(_authService, 'isUserLoggedIn').and.callThrough();
            spyOn(_userService, 'getDetailUser').and.callThrough();
            spyOn(component, 'setAppLanguage').and.callThrough();
            spyOn(component, 'getLanguages').and.callThrough();
            _authService.loginByUser(1).subscribe(user => {
                _userService.getDetailUser().subscribe(account => {
                    fixture.detectChanges();
                    expect(component.getLanguages).toHaveBeenCalled();
                    expect(_authService.isUserLoggedIn).toHaveBeenCalled();
                    expect(_userService.getDetailUser).toHaveBeenCalled();
                    expect(component.setAppLanguage).toHaveBeenCalledWith(account[0].user.language.key);
                })
            })

        })

        it('check onInit(), using company language ', () => {
            _companiesService.companies = makeCompanyData();
            spyOn(_authService, 'isUserLoggedIn').and.callThrough();
            spyOn(_userService, 'getDetailUser').and.callThrough();
            spyOn(component, 'setAppLanguage').and.callThrough();
            spyOn(_companiesService, 'getCompanies').and.callThrough();
            spyOn(component, 'getLanguages').and.callThrough();
            _authService.loginByUser(5).subscribe(user => {
                fixture.detectChanges();
                expect(component.getLanguages).toHaveBeenCalled();
                expect(_authService.isUserLoggedIn).toHaveBeenCalled();
                expect(_userService.getDetailUser).toHaveBeenCalled();
                expect(_companiesService.getCompanies).toHaveBeenCalled();
                expect(component.setAppLanguage).toHaveBeenCalledWith(_companiesService.companies[0].language.key);
            })

        })

    })

        const lang = {
            key: 'ES',
            langId: 1
        };
        it('check lang !== undefined', () => {
            spyOn(component, 'setAppLanguage');
            spyOn(_userService, 'updatelanguageUser');
            component.changeUserLang(lang);
            expect(component.setAppLanguage).toHaveBeenCalledWith(lang.key);
            expect(_userService.updatelanguageUser).toHaveBeenCalledWith(component.usuario.accountId, lang.langId);
        });
        */


    it('check if services was called without error', () => {
        spyOn(_authService, 'logout')
            .and
            .returnValue(new Promise(res => res('Deslogueado')));
        spyOn(component, 'successfullLogout');
        component.logout().then(() => {
            expect(_authService.logout).toHaveBeenCalled();
            expect(component.successfullLogout).toHaveBeenCalled();
        })
    })

    it('check if services was called with error', () => {
        spyOn(_authService, 'logout')
            .and
            .returnValue(new Promise((res, rej) => rej({ statusText: 'Error' })));
        spyOn(console, 'error');
        component.logout().then(() => {
            expect(_authService.logout).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('Error');
        });
    })

    it('should have return languages', () => {
        fixture.detectChanges();
        component.getLanguages();
        expect(component.languages.length).toBeGreaterThan(0);
    })

    it('should have return  [] languages', () => {
        fixture.detectChanges();
        _languageService.languages = null;
        component.getLanguages();
        expect(component.languages.length).toBe(0);
    })


    it('should clear cache on successfull logout ', () => {
        fixture.detectChanges();
        spyOn(_authService, 'clearCache');
        component.successfullLogout();
        expect(_authService.clearCache).toHaveBeenCalled();
    })

    it('have should call with a value', () => {
        fixture.detectChanges();
        spyOn(moment, 'locale');
        component.setAppLanguage('ES');
        expect(moment.locale).toHaveBeenCalledWith('ES');
    })

});
