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
import { VerificadoComponent } from '../../components/verificado/verificado.component';

// service & stub :)
import { AuthService } from '../../services/auth.service';
import { AuthServiceStub } from '../stubs/auth.service.stub';


// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { UserServiceStub } from 'app/tests/stubs/user.service.stub';
import { setTimeout } from 'timers';

const translationsMock = {
    'verified': {
        'verified': 'You are verified',
        'welcome': 'Welcome to OCP!!',
        'error': 'Something went wrong',
        'tryAgain': 'Try again',
        'login': 'Login',
    },
    'general': {
        'copyright': '© 2017 - OCP',
        'rightsReserved': 'All Rights reserved'
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


describe('VerificadoComponent', () => {
    let comp: VerificadoComponent;
    let fixture: ComponentFixture<VerificadoComponent>;
    let _authService: AuthService;
    let _userService: UserService;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                VerificadoComponent
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
                { provide: UserService, useClass: UserServiceStub }

            ]
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VerificadoComponent);
        _authService = TestBed.get(AuthService);
        _userService = TestBed.get(UserService);

        comp = fixture.componentInstance; // test instance
    });


    describe('On confirmEmailAccount() ', () => {
        it('should check if services was called', () => {
            spyOn(_userService, 'confirmAccount')
                .and
                .returnValue(new Promise(res => {return 'email check'}));
            comp.confirmEmailAccount('string', 'string');
            expect(_userService.confirmAccount).toHaveBeenCalled();
        });
    });

    describe('On manageError()', () => {
        it('should check if manageError was called with false', () => {
            comp.manageError(false);
            expect(comp.error).toBe(false);
        });
    });

    describe('On manageError()', () => {
        it('should check if manageError was called with true', () => {
            comp.manageError(true);
            expect(comp.error).toBe(true);
        });
    });

});
