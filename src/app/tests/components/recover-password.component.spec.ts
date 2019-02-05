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
import { ActivatedRoute } from '@angular/router';

// component
import { RecoverPasswordComponent } from '../../components/recover-password/recover-password.component';
import { LoginComponent } from '../../components/login/login.component';

// service & stub :)
import { AuthService } from '../../services/auth.service';
import { AuthServiceStub } from '../stubs/auth.service.stub';


// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { UserServiceStub } from 'app/tests/stubs/user.service.stub';
import { setTimeout } from 'timers';
import { Route } from '@angular/router/src/config';

const translationsMock = {
    'resetPw': {
        'msjRestore1': 'We will reset',
        'msjRestore2': 'your password',
        'errorPw1': 'The passwords do not match.',
        'errorPw2': 'Try again',
        'repeatPw': 'Repeat password'
    },
    'general': {
        'copyright': '© 2017 - OCP',
        'rightsReserved': 'All Rights reserved',
        'save': 'Save'
    }
};

class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}

class MockRouter {
    navigate(url: string) { return url; }
}


describe('RecoverPasswordComponent', () => {
    let comp: RecoverPasswordComponent;
    let fixture: ComponentFixture<RecoverPasswordComponent>;
    let _authService: AuthService;
    let _userService: UserService;
    const access_token = true;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                RecoverPasswordComponent,
                LoginComponent
            ],
            imports: [
                MaterialModule,
                FormsModule,
                BrowserModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                RouterTestingModule.withRoutes(
                    [{path: 'login', component: LoginComponent}]
            ),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                })
            ], providers: [
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: RouterTestingModule, useClass: MockRouter },
                { provide: UserService, useClass: UserServiceStub },
                {
                    provide: ActivatedRoute, useValue: {
                        queryParams: Observable.of({ access_token : access_token })
                    }
                },
            ]
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecoverPasswordComponent);
        _authService = TestBed.get(AuthService);
        _userService = TestBed.get(UserService);

        comp = fixture.componentInstance; // test instance
    });

    describe('On reestablecerPassword() with parameters', () => {

        it('should check if services was called',
            inject([Router], (router: Router) => {
                spyOn(_userService, 'resetPassword')
                    .and
                    .returnValue(new Promise(res => { return 'return' }));
                comp.reestablecerPassword('string', 'string');
                expect(_userService.resetPassword).toHaveBeenCalled();
            })
        );
    });

    describe('On reestablecerPassword() with differents values as parameters between each other a != b', () => {
        it('should ', () => {
            comp.reestablecerPassword('a', 'b');
            expect(comp.error).toBe(true);
        });
    });

    describe('On manageError()', () => {
        it('should check if manageError was called with true', () => {
            comp.manageError(true);
            expect(comp.errorService).toBe(true);
        });
    });

    describe('On manageError()', () => {
        it('should check if manageError was called with false', () => {
            comp.manageError(false);

            inject([Router], (router: Router) => {
                const spy = spyOn(router, 'navigate');
                const url = spy.calls.first().args[0];
                expect(url.toString()).toBe('/login');
            });
            expect(comp.errorService).toBe(false);
        });
    });

    describe('onInit()', () => {
        it('should ', () => {
            spyOn(comp, 'setAccessToken');
            fixture.detectChanges();
            expect(comp.setAccessToken).toHaveBeenCalledWith(access_token);
        });
    });

});
