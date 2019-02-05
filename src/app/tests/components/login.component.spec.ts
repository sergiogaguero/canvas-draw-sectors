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
import { RouterTestingModule } from '@angular/router/testing';

// Testing basics
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';

// component
import { LoginComponent } from '../../components/login/login.component';

// service & stub :)
import { AuthService } from '../../services/auth.service';
import { AuthServiceStub } from '../stubs/auth.service.stub';

// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
const translationsMock = {
    'login': {
        'msjPassReset1': 'Your password was reset',
        'msjPassReset2': 'You must login in order to access',
        'incorrectData': 'Wrong data',
        'password': 'Password',
        'remember': 'Remember',
        'messagePass': 'Have you forgetten your password?',
        'noEmailError': 'You must enter an e-mail',
        'wrongEmailError': 'The e-mail must have a valid format',
        'noPasswordError': 'You must enter a password'
    },
    'general': {
        'copyright': '© 2017 - OCP',
        'rightsReserved': 'All Rights reserved',
        'access': 'Access'
    }
};
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}

class MockRouter {
    navigateByUrl(url: string) { return url; }
}


describe('LoginComponent ', () => {
    let comp: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let _authService: AuthService;
    let _activatedRoute: ActivatedRoute;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoginComponent
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
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: RouterTestingModule, useClass: MockRouter },
                {
                    provide: ActivatedRoute, useValue: {
                        queryParams: Observable.of({ password_reset: true })
                    }
                },
            ]
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        _authService = TestBed.get(AuthService);
        _activatedRoute = TestBed.get(ActivatedRoute);

        comp = fixture.componentInstance; // test instance
    });

    it('should check queryParams onInit()', () => {
        spyOn(comp, 'setPasswordResetState');
        fixture.detectChanges();
        expect(comp.setPasswordResetState).toHaveBeenCalled();
    });

    it('should set the variables correctly if there\'s params on the route', () => {
        fixture.detectChanges();
        expect(comp.restablecida).toBeTruthy();
    });


    describe('On login() ', () => {
        it('should log in an user with valid login data', inject([Router], (router: Router) => {
            const spy = spyOn(router, 'navigateByUrl');
            comp.userToLogin.controls['email'].setValue('admin@customer.com');
            comp.userToLogin.controls['password'].setValue('sarlanga');
            comp.login();
            fixture.detectChanges();
            const url = spy.calls.first().args[0];
            expect(url).toBe(_authService.getRedirectUrl());
        }));

        it('shouldn\'t log in a user with invalid email format', () => {
            comp.userToLogin.controls['email'].setValue('esto no es un mail');
            comp.userToLogin.controls['password'].setValue('sarlanga');
            comp.login();
            fixture.detectChanges();
            expect(comp.userToLogin.valid).toBe(false);
        });
    });

});
