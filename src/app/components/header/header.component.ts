import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

// services
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { LanguagesService } from '../../services/languages.service';
import { CompaniesService } from '../../services/companies.service';
// Translate
import { TranslateService } from '@ngx-translate/core';
import { MatMenuTrigger } from '@angular/material/menu';
import * as moment from 'moment';
import * as locales from 'moment/min/locales';
import { MAT_DATE_LOCALE } from '@angular/material';
import { Account } from '../../classes/account';
import { Subscription } from 'rxjs/Subscription';
import { Language } from 'app/classes/language';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewChecked {
    @ViewChild(MatMenuTrigger) matMenu: MatMenuTrigger;
    errorLogin = false;
    recordLogin = true;
    usuario: Account;
    langKey = '';
    languages: Language[] = [];


    routerSubscription: Subscription;

    constructor(public userService: UserService,
        public authService: AuthService,
        private router: Router,
        private translate: TranslateService,
        private langService: LanguagesService,
        private companyService: CompaniesService
    ) {
    }
    ngAfterViewChecked() {
        if (this.authService.isUserLoggedIn() && (this.usuario === undefined || this.langKey === undefined)) {
            if (this.languages.length == 0) {
                this.getLanguages();
            }

            if (this.routerSubscription == undefined) {
                this.routerSubscription = this.router.events.subscribe(e => {
                    if (e instanceof NavigationEnd) {
                        this.userService.getDetailUser().subscribe(
                            response => {
                                if (this.authService.isUserLoggedIn()) {
                                    this.usuario = response[0];
                                    if (this.usuario.user.langId == null) {
                                        this.companyService.getCompanies().subscribe(res => {
                                            this.langKey = res[0].language.key;
                                            this.setAppLanguage(this.langKey);
                                        });
                                    } else {
                                        this.langKey = this.usuario.user.language.key;
                                        this.setAppLanguage(this.langKey);
                                    }
                                }
                            });
                    }
                });
            }
        }
    }


    // changes the user's language
    changeUserLang(lang) {
        if (lang !== undefined) {
            this.setAppLanguage(lang.key);
            this.userService.updatelanguageUser(this.usuario.userId, lang.langId);
        }
    }

    // sets the app's active language
    setAppLanguage(langKey: string) {
        this.translate.use(langKey.toLowerCase());
        moment.locale(langKey);
    }

    logout() {
        return this.authService.logout()
            .then(
            (response) => this.successfullLogout(),
            error => console.error(error.statusText)
            );
    }

    successfullLogout() {
        this.authService.clearCache();
        this.router.navigate([this.authService.getLoginUrl()]);
    };

    closeMenu() {
        this.matMenu.closeMenu();
    }

    getLanguages() {
        this.langService.getLanguages().subscribe(response => {
            if (response) {
                this.languages = response;
            } else {
                this.languages = [];
            }
        });
    }

}
