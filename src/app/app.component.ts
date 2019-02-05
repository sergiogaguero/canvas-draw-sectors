// angular basics
import { Component, Renderer2, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

// environments
import { environment } from '../environments/environment';

// Translate
import { TranslateService } from '@ngx-translate/core';


// google analytics
declare var gtag: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    analyticsId = environment.analytics;
    insightsId = environment.insightsId;

    constructor(
        public router: Router,
        private _renderer2: Renderer2,
        private translate: TranslateService,
        @Inject(DOCUMENT) private _document: Document,
    ) {
        translate.setDefaultLang('es');
    }

    ngOnInit() {
        // google analytics implementation
        if (this.analyticsId !== '') {
            // pushing into the dom a script with the references for google analytics
            let s1 = this._renderer2.createElement('script');
            s1.async = `async`;
            s1.src = `https://www.googletagmanager.com/gtag/js?id=${this.analyticsId}`;

            this._renderer2.appendChild(this._document.body, s1);

            let s2 = this._renderer2.createElement('script');
            s2.text = `window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());

                gtag('config', '${this.analyticsId}');`;

            this._renderer2.appendChild(this._document.body, s2);

            // we subscribe to the navigation end event to submit pageviews properly
            this.router.events.subscribe(event => this.registerPageNavigationEvent(event));
        }

        if (this.insightsId !== '') {
            // pushing into the dom a script with the references for azure application insights
            let s2 = this._renderer2.createElement('script');
            s2.text = `var appInsights=window.appInsights||function(a){
                function b(a){c[a]=function(){var b=arguments;c.queue.push(function(){c[a].apply(c,b)})}}var c={config:a},d=document,e=window;setTimeout(function(){var b=d.createElement("script");b.src=a.url||"https://az416426.vo.msecnd.net/scripts/a/ai.0.js",d.getElementsByTagName("script")[0].parentNode.appendChild(b)});try{c.cookie=d.cookie}catch(a){}c.queue=[];for(var f=["Event","Exception","Metric","PageView","Trace","Dependency"];f.length;)b("track"+f.pop());if(b("setAuthenticatedUserContext"),b("clearAuthenticatedUserContext"),b("startTrackEvent"),b("stopTrackEvent"),b("startTrackPage"),b("stopTrackPage"),b("flush"),!a.disableExceptionTracking){f="onerror",b("_"+f);var g=e[f];e[f]=function(a,b,d,e,h){var i=g&&g(a,b,d,e,h);return!0!==i&&c["_"+f](a,b,d,e,h),i}}return c
                }({
                    instrumentationKey:"${this.insightsId}"
                });
              
              window.appInsights=appInsights,appInsights.queue&&0===appInsights.queue.length&&appInsights.trackPageView();`;

            this._renderer2.appendChild(this._document.head, s2);
        }
    }

    registerPageNavigationEvent(event: any): boolean {
        if (event instanceof NavigationEnd) {
            gtag('config', this.analyticsId, {
                'page_title': 'Page',
                'page_location': 'http://' + environment.host + this.router.url,
                'page_path': this.router.url
            });
            return true;
        }
        return false;
    }
}
