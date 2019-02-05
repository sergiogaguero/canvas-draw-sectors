// Testing basics
import { ComponentFixture, TestBed, inject, getTestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';
import { By, BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

import { MaterialModule } from '../../material.module';
import { DebugElement } from '@angular/core';

import { StepperSplashComponent } from '../../components/splash-page/splash-page.component';
import {MatStepperModule} from '@angular/material/stepper';
// Translations
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// pipes
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { SafeHtmlPipe } from '../../pipes/textEditor.pipe';


// services
import { SplashPageService } from '../../services/splashPage.service';
import { EditorModule } from 'primeng/primeng';

const translationMock = {
  "splash-page": {
      "backgroundTitle": "Elije una imagen de fondo",
      "backgroundImage": "Imagen de fondo",
      "backgroundImageHint": "Un archivo JPG, PNG o GIF menor a 10MB",
      "colorHint": "Esto debería ser un color hexadecimal",
      "noColorError": "Debes ingresar un color de fondo",
      "invalidColorError": "El color de fondo elegido no es válido",
      "noBgImageError": "Debes ingresar una imagen de fondo",
      "logoTitle": "Elije un logo",
      "logoImage": "Imagen de logo",
      "noLogoImageError": "Debes ingresar una imagen de logo",
      "welcomeTitle": "Escribe un texto de bienvenida"
  },
  "general": {
    "fileExplorer": "Examinar"
  }
}

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of(translationMock);
  }
}


describe('SplashPageComponent', () => {
  let injector: TestBed;
  let component: StepperSplashComponent;
  let fixture: ComponentFixture<StepperSplashComponent>;
  let _splashPageService:SplashPageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        MaterialModule,
        EditorModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader, useClass: FakeLoader
          },
        }),
      ],
      providers: [
        SafeHtmlPipe,
        SplashPageService
      ],
      declarations: [StepperSplashComponent,
                     SafeHtmlPipe
      ],
    }).compileComponents().then(()=>{
      fixture = TestBed.createComponent(StepperSplashComponent);
      _splashPageService = TestBed.get(SplashPageService);

      component = fixture.debugElement.componentInstance;
      component.ngOnInit();
      fixture.detectChanges();
    })
  }));

  it("should have fileChangeBackground is called", ()=>{
    let events = {
        target: {
          files: [
              {
                  name: 'test image'
              }
          ]
        }
    }
    let file = events.target[0];
    let dataImage: any = {
        splash: {
            name: '',
            uploadedfile: null
        }
    }

    component.isLinear = false;
    component.dataImage.splash.uploadedfile = file;
    let spy = spyOn(_splashPageService, 'postBackgroundImage').and.callThrough();
    let spy2 = spyOn(component, 'getBackgroundURL').and.callThrough();
    component.fileChangeBackground(events);
    expect(component.isLinear).toEqual(false);
    expect(component.dataImage.splash.uploadedfile).not.toBeNull();
    expect(component.dataImage.splash.name).toBe('test image');
  })

  it("should have fileChangeLogo is called", ()=>{
    let events = {
        target: {
          files: [
              {
                  name: 'test image'
              }
          ]
        }
    }
    let file = events.target[0];
    let dataImage: any = {
        splash: {
            name: '',
            uploadedfile: null
        }
    }
    component.dataImage.splash.uploadedfile = file;
    let spy = spyOn(_splashPageService, 'postLogo').and.callThrough();
    let spy2 = spyOn(component, 'getBackgroundURL').and.callThrough();
    component.fileChangeLogo(events);
    expect(component.dataImage.splash.uploadedfile).not.toBeNull();
    expect(component.dataImage.splash.name).toBe('');
  })

  it("should have postText is called", ()=>{
    fixture.detectChanges();
    let spy = spyOn(_splashPageService, 'postText').and.callThrough();
    component.postText();
    expect(component.hideEditorText).toBe(false);
  })

  it("should have getBackgroundURL is called", ()=>{
    fixture.detectChanges();
    let spy = spyOn(_splashPageService, 'splashPageURL').and.callThrough();
    component.getBackgroundURL();
    expect(component.imgLoadingAttempt).toBeGreaterThan(0);
  })

  it("should have getLogo is called", ()=>{
    fixture.detectChanges();
    let spy = spyOn(_splashPageService, 'splashPageURL').and.callThrough();
    component.getLogoURL();
    expect(component.imgLoadingAttempt).toBeGreaterThan(0);
  })

  it("should have getText is called", ()=>{
    let result = "";
    fixture.detectChanges();
    let spy = spyOn(_splashPageService, 'getText').and.callThrough();
    component.getText();
    expect(component.text).not.toEqual(result);
  })

  it("should have saveSplashPage is called", ()=>{
    fixture.detectChanges();
    let spy = spyOn(_splashPageService, 'postSplashPage').and.callThrough();
    component.saveSplashPage();
  })

});
