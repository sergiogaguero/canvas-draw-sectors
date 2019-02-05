import { Routes } from '@angular/router';

import { ConfigStoreNewComponent } from '../../components/config-store-new/config-store-new.component';
import { ConfigStoreListComponent } from '../../components/config-store-list/config-store-list.component';
import { ConfigStoreEditComponent } from '../../components/config-store-edit/config-store-edit.component';
import { ConfigFloorsComponent } from '../../components/config-floors/config-floors.component';

// Routes
import { CONFIG_PISO_ROUTES } from '../../components/config-floors/config-floors.routes';

// Servicios
import { AuthGuardService } from '../../guards/auth-guard.service';


export const CONFIG_TIENDAS_ROUTES: Routes = [
// your root here is /settings/stores/
  {
    path: 'add',
    component: ConfigStoreNewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: ':id',
    component: ConfigStoreEditComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: ':id/floors',
    component: ConfigFloorsComponent,
    children: CONFIG_PISO_ROUTES
  }, 
  {
    path: '',
    component: ConfigStoreListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];