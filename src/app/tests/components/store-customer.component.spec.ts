// Testing basics
import { ComponentFixture, TestBed, inject, getTestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';
import { By, BrowserModule } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { DebugElement } from '@angular/core';

import { StoreCustomerComponent } from '../../components/store-customer/store-customer.component';

// Translations
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

// pipes
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

// services
import { RegionsService } from '../../services/regions.service';
import { UserService } from '../../services/user.service';
import { KpisService } from '../../services/kpis.service';
import { AuthService } from '../../services/auth.service';
import { FloorsService } from '../../services/floors.service';

// stubs
import { UserServiceStub } from 'app/tests/stubs/user.service.stub';
import { RegionsServiceStub } from 'app/tests/stubs/regions.service.stub';
import { KpisServiceStub } from 'app/tests/stubs/kpis.service.stub';
import { FloorsServiceStub } from '../stubs/floors.service.stub';

import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


const translationMock = {
  "store-customer": {
    "title": "Cliente 360",
    "subtitle": "Período seleccionado:",
    "cardCatchment": "Captación",
    "cardLoyalty": "Fidelización",
    "cardConversion": "Conversión",
    "tooltipCatchment": "Esta infocard nos muestra cómo las personas que pasan por la tienda se convierten en visitantes interesados. Esto nos puede ayudar a determinar cómo diferentes vidrieras o promociones captan la atención de los pasantes para hacerlos entrar y recorrer nuestra tienda!",
    "tooltipLoyalty": "Esta infocards nos muestra cuantos visitantes conocidos estamos recibiendo en nuestra tienda, y entonces debemos valorar su experiencia y aprovechar para mejorarla!",
    "tooltipConversion": "Esta infocard nos muestra cuantos clientes tenemos entre nuestros visitantes. Por tanto, nos ayuda a tomar dimensión del potencial de clientes que tenemos para capturar!",
    "notRegion":"No hay regiones asociadas",
    "notStore": "No hay tiendas asociadas"
  }
}
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of(translationMock);
  }
}

describe('StoreCustomerComponent', () => {
  let injector: TestBed;
  let component: StoreCustomerComponent;
  let fixture: ComponentFixture<StoreCustomerComponent>;
  let kpisService: KpisServiceStub;
  let userService: UserServiceStub;
  let regionsService: RegionsServiceStub;
  let _floorsServiceStub: FloorsServiceStub


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader, useClass: FakeLoader
          },
        }),
      ],
      providers: [
        CapitalizePipe,
        AuthService, FloorsService,
        { provide: UserService, useClass: UserServiceStub },
        { provide: RegionsService, useClass: RegionsServiceStub },
        { provide: KpisService, useClass: KpisServiceStub },
        { provide: FloorsService, useClass: FloorsServiceStub },
      ],
      declarations: [StoreCustomerComponent,
          CapitalizePipe
      ],
    }).compileComponents().then(()=>{
      fixture = TestBed.createComponent(StoreCustomerComponent);

      // userService = fixture.debugElement.injector.get(UserService);
      // regionsService = fixture.debugElement.injector.get(RegionsService);
      // kpisService = fixture.debugElement.injector.get(KpisService);
      userService = TestBed.get(UserService);
      kpisService = TestBed.get(KpisService);
      regionsService = TestBed.get(RegionsService);
      _floorsServiceStub = TestBed.get(FloorsService);

      component = fixture.debugElement.componentInstance;
      component.ngOnInit();
      fixture.detectChanges();
    })
  }));

  it('should have captation values', ()=>{
    fixture.detectChanges();
    let captation = fixture.debugElement.query(By.css('#captacion')).nativeElement.children[1].innerText;
    fixture.detectChanges();
    expect(captation).toEqual('25, 23 %');

  })

  describe('should have all case updateRegion', () => {
    it('should have updateRegion when selectedRegion ===-1', () => {
      let selectedRegion = -1;
      fixture.detectChanges();
      component.selectedRegion = selectedRegion;
      let spy2 = spyOn(component, 'getCockPit');
      component.updateRegion();
      expect(spy2).toHaveBeenCalled();
      expect(component.selectedStore).toBe(-1);
      expect(component.canSelectStore).toBe(false);
      expect(component.notStores).toBe(false);
    })

    it('should have updateRegion when selectedRegion have not stores', () => {
      let selectedRegion = {
        stores: []
      }
      fixture.detectChanges();
      component.selectedRegion = selectedRegion;
      let spy2 = spyOn(component, 'getCockPit');
      component.updateRegion();
      expect(spy2).not.toHaveBeenCalled();
      expect(component.selectedStore).toBe(-1);
      expect(component.canSelectStore).toBe(false);
      expect(component.notStores).toBe(true);
    })

    it('should have updateRegion when selectedRegion have stores', () => {
      let selectedRegion = {
        stores: ['STORE']
      }
      fixture.detectChanges();
      component.selectedRegion = selectedRegion;
      let spy2 = spyOn(component, 'getCockPit');
      component.updateRegion();
      expect(spy2).toHaveBeenCalled();
      expect(component.selectedRegion.stores.length).toBeGreaterThan(0);
      expect(component.selectedStore).toBe(-1);
      expect(component.canSelectStore).toBe(true);
      expect(component.notStores).toBe(false);
    })
  })

  describe('should have selectCurrentStore', () =>{
    it('should have selectCurrentStore when !==-1 && length=0', ()=>{
      let selectedStore = {};
      component.selectedStore = selectedStore;
      let spy = spyOn(_floorsServiceStub, 'getFloorsByStore').and.callThrough();
      component.selectCurrentStore();
      expect(component.noMapError).toBe(false);
      expect(_floorsServiceStub.getFloorsByStore).toHaveBeenCalledWith(selectedStore);
      expect(component.contentExist).toBe(true);
      expect(component.noFloorsError).toBe(true);
      expect(component.loading).toBe(false);
    })


    it('should have selectCurrentStore when selectedStore === -1 && branch else', ()=>{
      let selectedStore = -1;
      component.selectedStore = selectedStore;
      let spy = spyOn(component, 'getCockPit');
      component.selectCurrentStore();
      expect(component.noFloorsError).toBe(false);
      expect(component.noMapError).toBe(false);
      expect(component.getCockPit).toHaveBeenCalled();
      expect(component.loading).toBe(false);
    })

    it('should have selectCurrentStore when selectedStore === -1 && branch for->if(1)', ()=>{
      let selectedRegion = {
        stores: ['STORE']
      };
      let floors = [{
          name: 'Floor 1',
          storeId: 1
      }]
      component.selectCurrentStore();
      component.selectedRegion = selectedRegion;
      component.noFloorsError = false;
      expect(floors.length).toBeGreaterThan(0);
      expect(component.noFloorsError).toBe(false);
      expect(component.loading).toBe(false);
    })

    it('should have selectCurrentStore when selectedRegion !== -1 && branch for->if(3)', ()=>{
      let selectedStore = -1;
      let selectedRegion = {
        stores: [{
          name: 'STORE',
          storeId:1,
        }],
      };

      component.selectedStore = selectedStore;
      component.selectedRegion = selectedRegion;
      component.noFloorsError = false;
      component.noMapError = true;
      component.selectCurrentStore();

      expect(component.noFloorsError).toBe(false);
      expect(component.noMapError).toBe(true);
      expect(component.loading).toBe(false);
    })

  })

  describe('should have getCockPit', ()=>{
    it('when selectedRegion!==-1 && role.name==Admin', () =>{
      let selectedRegion = {
        regionId: 1
      };
      let role = {
        name: 'Admin'
      }
      const params = {
        regionId: 1
      }
      component.selectedRegion = selectedRegion;
      component.roleName = role.name;
      component.getCockPit();
      expect(params.regionId).toEqual(selectedRegion.regionId);
    })

    it('when selectedRegion!==-1 && role.name!=storeMgr', () =>{
      let selectedStore = 1;
      let role = {
        name: 'Admin'
      }
      const params = {
        storeId: 1
      }
      component.selectedStore = selectedStore;
      component.roleName = role.name;
      component.getCockPit();
      expect(params.storeId).toEqual(selectedStore);
    })

  })

  describe('should have getDataClient360', () => {
    it('when call getDataClient360', () => {
      let selectedRegion = {
        stores: [{
          name: 'STORE',
          storeId:1,
        }],
      };

      component.canSelectRegion = false;
      component.canSelectStore = true;
      component.selectedRegion = selectedRegion;
      spyOn(userService, 'getDetailUser').and.callThrough();
      spyOn(regionsService, 'getRegionsByRole').and.callThrough();
      component.getDataClient360();
      expect(component.canSelectRegion).toBe(false);
      expect(component.selectedRegion.stores.length).toEqual(1);
    })
  })


})
