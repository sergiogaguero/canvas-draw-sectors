// project basics
import { By, BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { MaterialModule } from '../../material.module';

// Testing basics
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

// component
import { AppComponent } from '../../app.component';

// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';
import { UserServiceStub } from '../stubs/user.service.stub';
import { UserService } from '../../services/user.service';
import { AuthServiceStub } from '../stubs/auth.service.stub';
import { AuthService } from '../../services/auth.service';
import { LanguagesService } from '../../services/languages.service';
import { LanguagesServiceStub } from '../stubs/languages.service.stub';
import { CompaniesServiceStub } from '../stubs/companies.service.stub';
import { CompaniesService } from '../../services/companies.service';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd } from '@angular/router';
const translationsMock = {
};
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}


describe('AppComponent ', () => {
    let fixture: ComponentFixture<AppComponent>;
    let comp: AppComponent;
    let doc: Document

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                HeaderComponent,
                SideNavComponent
            ],
            imports: [
                MaterialModule,
                RouterTestingModule,
                BrowserModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                })
            ],
            providers: [
                { provide: UserService, useClass: UserServiceStub },
                { provide: AuthService, useClass: AuthServiceStub },
                { provide: LanguagesService, useClass: LanguagesServiceStub },
                { provide: CompaniesService, useClass: CompaniesServiceStub }
            ]
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);

        comp = fixture.componentInstance; // test instance

        doc = TestBed.get(DOCUMENT);
    });

    it('should inject analytics tag if there\'s an analytics id', () => {
        comp.analyticsId = 'totallyvalidid';
        fixture.detectChanges();
        expect(doc.body.querySelector('script[async]').getAttribute('src')).toContain(comp.analyticsId);
    });

    it('should run the gtag function on navigation end', () => {
        const event = new NavigationEnd(1, 'url', 'urlAfterRedirects');
        const result = comp.registerPageNavigationEvent(event);
        expect(result).toBeTruthy('The event should\'ve been registered with gtag');
    });

});
