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
import { ComponentFixture, TestBed, inject, fakeAsync, tick, async } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// component
import { SideNavComponent } from '../../components/side-nav/side-nav.component';

// service & stub :)
import { AuthService } from '../../services/auth.service';
import { AuthServiceStub } from '../stubs/auth.service.stub';
import { UserService } from 'app/services/user.service';
import { UserServiceStub } from 'app/tests/stubs/user.service.stub';

// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

const translationsMock = {
    'side-nav': {
        'store-operations': 'Store Operations',
        'configuration': 'Settings',
        'logout': 'Logout'
    },
    'store-customer': {
        'title': 'Client 360',
    },
    'salesforce': {
        'title': 'Sales force',
    },
    'reports': {
        'title': 'Reports',
        'performance': 'Visitors'
    },
    'config': {
        'user': {
            'users': 'Users'
        },
        'apis': {
            'title': 'API Portal'
        }
    },
    'general': {
        'stores': 'Stores',
        'regions': 'Regions'
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


describe('SideNavComponent', () => {
    let comp: SideNavComponent;
    let fixture: ComponentFixture<SideNavComponent>;
    let _authService: AuthService;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SideNavComponent
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
        fixture = TestBed.createComponent(SideNavComponent);
        _authService = TestBed.get(AuthService);

        comp = fixture.componentInstance; // test instance
    });


    describe('On isUserLoggedIn() ', () => {
        it('should not be logged in by default', () => {
            const isLoggedIn = comp.isUserLoggedIn();

            expect(isLoggedIn).toBe(false);
        });

        it('should return true when logged in', () => {
            _authService.login('any').subscribe(
                result => {
                    const isLoggedIn = comp.isUserLoggedIn();

                    expect(isLoggedIn).toBe(true);
                }
            )
        });
    });
/*
    describe('On switchSubMenu()', fakeAsync(() => {
        it('should open tab reports', () => {
            const timeout = comp.switchSubMenu('reports');
            tick(500);
            expect(comp.submenus.reports).toBeTruthy();
        });
    }));
*/
    describe('On closeMenu()', () => {
        it('should close menu when clicked any icon of side-nav without delay', () => {
            const checkDelay = comp.closeMenu();
            expect(checkDelay).toBeFalsy();
        });

        it('should close menu when clicked any icon of side-nav with delay', fakeAsync(() => {
            comp.menuStatus = true;

            const checkDelay = comp.closeMenu(250);
            tick(500);
            expect(checkDelay).toBeTruthy('check delay');
            expect(comp.menuStatus).toBeFalsy('MENUSTATUS');
        }));
    });

    describe('On logout()', () => {
        it('check if services was called', () => {
            spyOn(_authService, 'logout')
                .and
                .returnValue(new Promise(res => {return null}));
            spyOn(_authService, 'clearCache');
            comp.logout();
            expect(_authService.logout).toHaveBeenCalled();
        })
    });

});
