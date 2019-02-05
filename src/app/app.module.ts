// Angular basics
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// module imports
import { MaterialModule } from './material.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ServicesModule } from 'app/services.module';


// external packages
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AgmCoreModule } from '@agm/core';
import {EditorModule} from 'primeng/editor';

// routing
import { APP_ROUTING } from './app.routes';

// Pipes
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { DateFormatPipe } from './pipes/date.pipe';
import { OrderByPipe } from './pipes/orderBy.pipe';
import { UnitSuffixPipe } from './pipes/unitSuffix.pipe';
import { FormatPipe } from './pipes/format.pipe';
import { SafeHtmlPipe } from './pipes/textEditor.pipe';

// guards
import { AuthGuardService } from './guards/auth-guard.service';
import { AuthGuardLogin } from './guards/auth-login.guard';
import { OcpHttpInterceptor } from './services/http.interceptor';

// Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpLoaderFactory } from './factories/translate.factory';


// directives
import { GridListDirective } from './directives/grid-list.directive';
import { Constants } from './classes/constants';

// Components
import { AppComponent } from './app.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { HeaderComponent } from './components/header/header.component';
import {
  ConfigGeneralComponent,
  SettingsConfirmationDialog
} from './components/config-general/config-general.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { StoreOperationsComponent } from './components/store-operations/store-operations.component';
import { ReportsComponent } from './components/reports/reports.component';
import { LoginComponent } from './components/login/login.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ConfigStatusComponent } from './components/config-status/config-status.component';
import { ConfigStoreComponent } from './components/config-store/config-store.component';
import {
  ConfigRegionsComponent,
  AddRegionDialog,
  EditRegionDialog,
  DeleteRegionDialog,
} from './components/config-regions/config-regions.component';
import {
  ConfigUsuariosComponent,
  AddUserDialog,
  DeleteUserDialog
} from './components/config-usuarios/config-usuarios.component';
import { ReportVisitorsComponent } from './components/report-visitors/report-visitors.component';
import { ConfigStoreNewComponent } from './components/config-store-new/config-store-new.component';
import {
  ConfigStoreListComponent,
  DeleteStoreDialog
} from './components/config-store-list/config-store-list.component';
import {
  ConfigStoreEditComponent,
  DeleteFloorDialog,
  EditFloorDialog,
} from './components/config-store-edit/config-store-edit.component';
import { ConfigFloorsComponent } from './components/config-floors/config-floors.component';
import {
  ConfigFloorsEditComponent,
  NewMapDialog,
  EditMapDialog,
  DeleteMapDialog
} from './components/config-floors-edit/config-floors-edit.component';
import { SectionDrawingComponent } from './components/section-drawing/section-drawing.component';
import { StoreChainOperationsComponent } from './components/store-chain-operations/store-chain-operations.component';
import { ConfigApisComponent, NewTokenDialog, DeleteTokenDialog } from './components/config-apis/config-apis.component';
import { VerificadoComponent } from './components/verificado/verificado.component';
import { MessageDialog } from './components/message-dialog/message-dialog.component';
import { SalesforceComponent } from './components/salesforce/salesforce.component';
import { StoreCustomerComponent } from './components/store-customer/store-customer.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorHandlingComponent } from './components/error-handling/error-handling.component';
import { StepperSplashComponent } from './components/splash-page/splash-page.component';


@NgModule({
  declarations: [
    // components
    AppComponent,
    ConfigApisComponent,
    ConfigFloorsComponent,
    ConfigFloorsEditComponent,
    ConfigRegionsComponent,
    ConfigStoreComponent,
    ConfigStoreEditComponent,
    ConfigStoreListComponent,
    ConfigStoreNewComponent,
    ConfigGeneralComponent,
    ConfigUsuariosComponent,
    ForbiddenComponent,
    HeaderComponent,
    StoreOperationsComponent,
    LoginComponent,
    ForgotPasswordComponent,
    RecoverPasswordComponent,
    ReportsComponent,
    ReportVisitorsComponent,
    SectionDrawingComponent,
    SettingsComponent,
    SideNavComponent,
    VerificadoComponent,
    SalesforceComponent,
    StoreCustomerComponent,
    ConfigStatusComponent,
    StepperSplashComponent,


    // pipes
    CapitalizePipe,
    DateFormatPipe,
    OrderByPipe,
    UnitSuffixPipe,
    SafeHtmlPipe,

    // dialogs
    DeleteStoreDialog,
    DeleteFloorDialog,
    DeleteMapDialog,
    NewMapDialog,
    EditMapDialog,
    EditFloorDialog,
    MessageDialog,
    AddUserDialog,
    DeleteUserDialog,
    AddRegionDialog,
    EditRegionDialog,
    DeleteRegionDialog,
    NewTokenDialog,
    DeleteTokenDialog,
    SettingsConfirmationDialog,

    // directives
    GridListDirective,
    StoreChainOperationsComponent,
    FormatPipe,

    HomeComponent,
    ErrorHandlingComponent,

  ],
  entryComponents: [
    AddRegionDialog,
    EditRegionDialog,
    DeleteFloorDialog,
    DeleteStoreDialog,
    DeleteMapDialog,
    EditFloorDialog,
    MessageDialog,
    NewMapDialog,
    EditMapDialog,
    DeleteRegionDialog,
    AddUserDialog,
    DeleteUserDialog,
    DeleteRegionDialog,
    NewTokenDialog,
    DeleteTokenDialog,
    SettingsConfirmationDialog,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: Constants.googleMapsKey,
      libraries: ['places']
    }),
    APP_ROUTING,
    BrowserModule,
    BrowserAnimationsModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FlexLayoutModule,
    ServicesModule,
    EditorModule
  ],
  providers: [
    // KEEP THE ALPHABETICAL ORDER GOIN', GUYS!
    AuthGuardLogin,
    AuthGuardService,
    CapitalizePipe,
    DateFormatPipe,
    UnitSuffixPipe,
    {
      provide: HTTP_INTERCEPTORS, useClass: OcpHttpInterceptor, multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
