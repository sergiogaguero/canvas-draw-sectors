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

// Components
import { StoreChainOperationsComponent } from '../../components/store-chain-operations/store-chain-operations.component';

// Translations
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

// services
import { RegionsService } from '../../services/regions.service';
import { UserService } from '../../services/user.service';
import { KpisService } from '../../services/kpis.service';
import { AuthService } from '../../services/auth.service';

// pipes
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { FormatPipe } from '../../pipes/format.pipe';

import { Moment } from 'moment';
import { environment as env } from '../../../environments/environment';
import { Constants } from '../../classes/constants';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableDataSource } from '@angular/material';
import { UserServiceStub } from 'app/tests/stubs/user.service.stub';
import { RegionsServiceStub } from 'app/tests/stubs/regions.service.stub';
import { KpisServiceStub } from 'app/tests/stubs/kpis.service.stub';
import { format } from 'path';

const baseURL = `http://${env.host}:${env.port}/api/`;

const translationsMock = {
  'store-chain-operations': {
    'title': 'Operaciones de la cadena',
    'sales': 'Ventas',
    'ticketPromedio': 'Ticket promedio',
    'upt': 'upt',
    'tooltipSales': 'Esta infocard nos muestra monto de ventas',
    'tooltipticket': 'Esta infocard nos muestra monto de compra promedio de los consumidores',
    'tooltipUpt': 'Esta infocard nos muestra canasta promedio de artículos que nuestros consumidores adquieren'
  },
  'salesforce': {
    'selectedPeriod': 'Período seleccionado',
  }
}

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return Observable.of(translationsMock);
  }
}

describe('StoreChainOperationsComponent', () => {
  let component: StoreChainOperationsComponent;
  let fixture: ComponentFixture<StoreChainOperationsComponent>;
  let kpisService: KpisService;
  let userService: UserService;
  let regionsService: RegionsService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
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
        { provide: UserService, useClass: UserServiceStub },
        FormatPipe,
        { provide: RegionsService, useClass: RegionsServiceStub },
        { provide: KpisService, useClass: KpisServiceStub },
        CapitalizePipe,
        AuthService
      ],
      declarations: [StoreChainOperationsComponent,
        CapitalizePipe,
        FormatPipe
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(StoreChainOperationsComponent);

      userService = fixture.debugElement.injector.get(UserService);
      regionsService = fixture.debugElement.injector.get(RegionsService);
      kpisService = fixture.debugElement.injector.get(KpisService);

      component = fixture.debugElement.componentInstance;

      component.ngOnInit();
      fixture.detectChanges();
    });
  }));

  it('should have total amount', (done) => {
    fixture.detectChanges();

    // valor dentro del DOM
    const totalSalesComponent = fixture.debugElement.query(By.css('#sales')).children[1].childNodes['0'].nativeNode.data;
    fixture.detectChanges();
    kpisService.getKpisChainOperations(1).toPromise().then(e => {
      const totalSalesService = e.body.sales.total;
      const unit = totalSalesComponent.substring(6, 7);

      // const valor = new FormatPipe().transform(totalSalesService, unit);
      expect(totalSalesComponent).toEqual('984,79K');
      done();
    });
  });

  it('should have sort button', () => {
    fixture.detectChanges();
    let sortText = fixture.debugElement.query(By.css('.mat-sort-header-button')).children[0].nativeElement.innerText;
    const sortButtom = fixture.debugElement.query(By.css('.mat-sort-header-button')).nativeElement;
    let firstDatum = fixture.debugElement.query(By.css('#position')).nativeElement.innerText;

    expect(firstDatum).toEqual('#1');
    expect(sortText).toEqual('Top');

    sortButtom.click();
    fixture.detectChanges();

    sortText = fixture.debugElement.query(By.css('.mat-sort-header-button')).children[0].nativeElement.innerText;
    firstDatum = fixture.debugElement.query(By.css('#position')).nativeElement.innerText;

    expect(firstDatum).toEqual('#3');
    expect(sortText).toEqual('Bottom');
  });

});
