// angular basics
import { Routes } from '@angular/router';

// guards
import { AuthGuardService } from '../../guards/auth-guard.service';

// components
import { ConfigFloorsEditComponent } from '../../components/config-floors-edit/config-floors-edit.component';
import { ConfigStoreEditComponent } from '../../components/config-store-edit/config-store-edit.component';

export const CONFIG_PISO_ROUTES: Routes = [
// your root here is /settings/stores/:id/floors/
    {
        path: ':id',
        component: ConfigFloorsEditComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '',
        component: ConfigStoreEditComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: ''
    }
];