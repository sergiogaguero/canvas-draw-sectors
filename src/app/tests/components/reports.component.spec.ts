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
import { ReportsComponent } from '../../components/reports/reports.component';

// service & stub :)
import { AuthService } from '../../services/auth.service';
import { AuthServiceStub } from '../stubs/auth.service.stub';
import { UserService } from '../../services/user.service';
import { UserServiceStub } from '../stubs/user.service.stub';

// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
const translationsMock = {
    'reports': {
        'performance': 'Visitors',
        'title': 'Reports'
    }
};
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}


describe('ReportsComponent ', () => {
    let comp: ReportsComponent;
    let fixture: ComponentFixture<ReportsComponent>;
    let _authService: AuthService;
    let _userService: UserService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ReportsComponent
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
                { provide: AuthService, useClass: AuthServiceStub }
            ]
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportsComponent);
        _authService = TestBed.get(AuthService);
        _userService = TestBed.get(UserService);

        comp = fixture.componentInstance; // test instance
    });

    it('shouldn\'t have any visible links by default', () => {
        for (const menu in comp.menuVisibility) {
            if (menu) {
                expect(comp.menuVisibility[menu]).toBe(false,
                    menu + ' should be false');
            }
        }
    });

    it('should show all nav items once logged in as admin', () => {
        _authService.login('just log in gdi').subscribe( res => {
            fixture.detectChanges();
            for (const menu in comp.menuVisibility) {
                if (menu) {
                    expect(comp.menuVisibility[menu]).toBe(false,
                        menu + ' should be true');
                }
            }
        });
    });

});
