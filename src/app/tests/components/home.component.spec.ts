import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { HomeComponent } from '../../components/home/home.component';
import { MaterialModule } from '../../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserService } from '../../services/user.service';
import { UserServiceStub } from '../stubs/user.service.stub';
import { Observable } from 'rxjs/Observable';

// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Account } from '../../classes/account';
const translationsMock = {};
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}

class MockRouter {
    navigateByUrl(url: string) { return url; }
}


describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let _usersService: UserService;
    let user: Account;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomeComponent
            ],
            imports: [
                MaterialModule,
                FlexLayoutModule,
                BrowserModule,
                HttpClientTestingModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                })
            ],
            providers: [
                { provide: UserService, useClass: UserServiceStub }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        _usersService = TestBed.get(UserService);
        user = {
            'accountId': 1,
            'userId': 1,
            'name': 'Sergo',
            'lastname': 'Aguero',
            'email': 'ocpqa@grupoassa.com',
            'roleId': 1,
            'timezone': '2017-08-29T12:12:31.949Z',
            'user': {
                'userId': 1,
                'tenantId': 1,
                'email': 'ocpqa@grupoassa.com',
                'emailVerified': true,
                'langId': 1,
                'language': {
                    'langId': 1,
                    'name': 'Español',
                    'key': 'ES'
                }
            },
            'role': {
                'roleId': 1,
                'name': 'Admin'
            }
        };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should run some basic functions onInit()', () => {
        spyOn(component, 'getUserInfo');

        fixture.detectChanges();
        expect(component.getUserInfo).toHaveBeenCalled();
    });

    it('should get the user\'s data on getUserInfo()', () => {
        spyOn(_usersService, 'getDetailUser').and.returnValue(Observable.of([user]));

        component.getUserInfo();
        expect(_usersService.getDetailUser).toHaveBeenCalled();
        expect(component.user).toBe(user);
    });

    it('should get the user\'s data on ngAfterViewChecked()', () => {
        spyOn(_usersService, 'getDetailUser').and.returnValue(Observable.of([user]));

        fixture.detectChanges();
        expect(component.tallestCardContent).toBe('auto');
        fixture.detectChanges();
        expect(component.tallestCardContent).toBeGreaterThan(0);
    });
});
