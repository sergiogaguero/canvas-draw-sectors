import { RouterModule, Routes } from '@angular/router';

// Componentes
import { StoreOperationsComponent } from './components/store-operations/store-operations.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SalesforceComponent } from './components/salesforce/salesforce.component';
import { LoginComponent } from './components/login/login.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VerificadoComponent } from './components/verificado/verificado.component';
import { StoreCustomerComponent } from './components/store-customer/store-customer.component';
import { StoreChainOperationsComponent } from './components/store-chain-operations/store-chain-operations.component';


// Servicios
import { AuthGuardService } from './guards/auth-guard.service';
import { AuthGuardLogin } from './guards/auth-login.guard';

// Routers
import { REPORTES_ROUTES } from './components/reports/reports.routes';
import { CONFIGURACIONES_ROUTES } from './components/settings/settings.routes';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { HomeComponent } from './components/home/home.component';

import { ErrorHandlingComponent } from './components/error-handling/error-handling.component';

export const APP_ROUTES: Routes = [
    { path: 'confirmar', component: VerificadoComponent },
    { path: 'reset-password', component: RecoverPasswordComponent, canActivate: [AuthGuardLogin] },
    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthGuardLogin] },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuardLogin] },
    {
        path: 'store-operations',
        component: StoreOperationsComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'store-chain-operations',
        component: StoreChainOperationsComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuardService],
        children: REPORTES_ROUTES
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuardService],
        children: CONFIGURACIONES_ROUTES
    },
    {
        path: 'salesforce',
        component: SalesforceComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'store-customer',
        component: StoreCustomerComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'forbidden',
        component: ForbiddenComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'error-handling',
        component: ErrorHandlingComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuardService]
    },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });
