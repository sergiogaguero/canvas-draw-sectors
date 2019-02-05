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
import {
    ConfigApisComponent,
    NewTokenDialog,
    DeleteTokenDialog
} from '../../components/config-apis/config-apis.component';

// service & stub :)
import { ApiTypesService } from '../../services/apiTypes.service';
import { ApiTypesServiceStub } from './../stubs/apiTypes.service.stub';
import { TokensService } from '../../services/tokens.service';
import { TokensServiceStub } from './../stubs/tokens.service.stub';


// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { MessageDialog } from '../../components/message-dialog/message-dialog.component';
const translationsMock = {
    'config': {
        'apis': {
            'title': 'API Portal',
            'subtitle': 'Token listing',
            'addToken': 'New token',
            'addTokenSuccessTitle': 'Token created',
            'addTokenSuccessMessage': 'The token was created successfully.',
            'api': 'API',
            'label': 'Label',
            'token': 'Token',
            'revoke': 'Revoke',
            'revokeToken': 'Revoke token',
            'revokeTokenConfirmation': 'You\'re about to delete the token {{label}}',
            'revokeTokenSuccessTitle': 'Token revoked',
            'revokeTokenSuccessMessage': 'The token was revoked successfully.',
            'noTokensErrorTitle': 'Oops! You haven\'t set up any APIs!',
            'noTokensError': 'Don\'t worry, you can start creating tokens for your APIs right now.',
            'add': {
                'apiType': 'API type',
                'apiTypeSelect': 'Choose an API type',
                'noApiTypeError': 'You must choose an API type for the token',
                'noLabelError': 'You must enter a label for the token'
            }
        },
    },
    'general': {
        'cancel': 'Cancel',
        'save': 'Save',
        'accept': 'Accept',
        'delete': 'Delete',
    }
};
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}


describe('ConfigApisComponent ', () => {
    let comp: ConfigApisComponent;
    let fixture: ComponentFixture<ConfigApisComponent>;
    let _apiTypesService: ApiTypesService;
    let _tokensService: TokensService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfigApisComponent,
                DeleteTokenDialog,
                NewTokenDialog,
                MessageDialog
            ],
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
                { provide: ApiTypesService, useClass: ApiTypesServiceStub },
                { provide: TokensService, useClass: TokensServiceStub },
            ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [
                    DeleteTokenDialog,
                    NewTokenDialog,
                    MessageDialog
                ]
            }
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigApisComponent);
        _apiTypesService = TestBed.get(ApiTypesService);
        _tokensService = TestBed.get(TokensService);

        comp = fixture.componentInstance; // test instance
    });

    it('should have some tokens onInit', () => {
        _tokensService.getTokens().subscribe(tokensResponse => {
            fixture.detectChanges();
            expect(comp.tokens).toBe(tokensResponse,
                'Should have expected the correct tokens from the service');
        });
    });

    it('should update tokens on getTokens', () => {
        comp.tokens = [];
        _tokensService.getTokens().subscribe(tokensResponse => {
            comp.getTokens();
            fixture.detectChanges();
            expect(comp.tokens).toBe(tokensResponse,
                'Should have expected the correct tokens from the service');
        });
    });

    describe('when adding tokens', () => {
        it('should open the dialog when newTokenDialog()', () => {
            const dialogRef = comp.newTokenDialog();
            fixture.detectChanges();
            expect(dialogRef.componentInstance instanceof NewTokenDialog).toBe(true);
            expect(dialogRef.componentInstance.data.label).toBe('');
            expect(dialogRef.componentInstance.data.apiTypeId).toBe(null);

            dialogRef.componentInstance.saveToken();
            fixture.detectChanges();
            expect(dialogRef.componentInstance.addToken.valid).toBe(false);
        });

        it('addToken() should create the token', () => {
            _tokensService.getTokens().subscribe(tokens => {
                const futureTokenId = tokens.length + 1;
                const token = { label: 'New api token', apiTypeId: 1 };
                comp.addToken(token);
                fixture.detectChanges();
                _tokensService.getTokens().subscribe(resultTokens => {
                    expect(resultTokens.filter(t => t.id === futureTokenId)[0].label).toBe(token.label);
                });
            });
        });
    });

    describe('when deleting tokens', () => {
        let token;
        beforeEach(() => {
            token = { label: 'Employee Connection', id: 2 };
        });

        it('should open the dialog when deleteTokenDialog()', () => {
            const dialogRef = comp.deleteTokenDialog(token);
            fixture.detectChanges();
            expect(dialogRef.componentInstance instanceof DeleteTokenDialog).toBe(true);
            expect(dialogRef.componentInstance.data.label).toBe(token.label);
            expect(dialogRef.componentInstance.data.id).toBe(token.id);
        });

        it('deleteToken() should delete the token', () => {
            comp.deleteToken(token);
            fixture.detectChanges();
            _tokensService.getTokens().subscribe(resultTokens => {
                expect(resultTokens.filter(t => t.id === token.id).length).toBe(0);
            })
        });
    });
});
