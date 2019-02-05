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
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';

// component
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';

// service & stub :)
import { UserService } from '../../services/user.service';
import { UserServiceStub } from '../stubs/user.service.stub';


// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
const translationsMock = {
    'forgotPw': {
        'msjRememberPass1': 'If you don\'t remember your password, enter ',
        'msjRememberPass2': 'your e-mail and we will send you',
        'msjRememberPass3': 'instructions for reseting it',
        'errorEmail1': 'The entered E-mail is incorrect.',
        'errorEmail2': 'Please, try again',
        'msjReset1': 'We sent you an e-mail for',
        'msjReset2': 'reseting your password.',
        'notArrived': 'Haven\'t you received the e-mail?',
        'resendEmail': 'Resend e-mail',
        'backStart': 'Return to login'
    },
    'general': {
        'copyright': '© 2017 - OCP',
        'rightsReserved': 'All Rights reserved'
    },
    'login': {
        'wrongEmailError': 'The e-mail must have a valid format',
        'noPasswordError': 'You must enter a password'
    },
};
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}


describe('ForgotPasswordComponent ', () => {
    let comp: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let _userService: UserService;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ForgotPasswordComponent
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
                { provide: UserService, useClass: UserServiceStub }
            ]
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ForgotPasswordComponent);
        _userService = TestBed.get(UserService);

        comp = fixture.componentInstance; // test instance
    });


    describe('requestPassword()', () => {
        it('should should send an email someone with a correct email', () => {
            comp.resetPasswordForm.controls['email'].setValue('admin@customer.com');
            comp.requestPassword(comp.resetPasswordForm.controls['email'].value).then(function () {
                expect(comp.enviado).toBe(true);
                expect(comp.error).toBe(false);
            })
        });

        it('shouldn\'t reset password to a user with invalid email format', () => {
            comp.resetPasswordForm.controls['email'].setValue('esto no es un mail');
            comp.requestPassword(comp.resetPasswordForm.controls['email'].value);
            fixture.detectChanges();
            expect(comp.resetPasswordForm.valid).toBe(false);
        });
    });

});
