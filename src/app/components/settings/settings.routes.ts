// Angular basics
import { Routes } from '@angular/router';

// Components
import { ConfigRegionsComponent } from '../../components/config-regions/config-regions.component';
import { ConfigStoreComponent } from '../../components/config-store/config-store.component';
import { ConfigUsuariosComponent } from '../../components/config-usuarios/config-usuarios.component';
import { ConfigGeneralComponent } from '../../components/config-general/config-general.component';
import { ConfigStatusComponent } from '../../components/config-status/config-status.component';
import { StepperSplashComponent } from '../../components/splash-page/splash-page.component';


// Services
import { AuthGuardService } from '../../guards/auth-guard.service';

// Child Routes
import { CONFIG_TIENDAS_ROUTES } from '../../components/config-store/config-store.routes';
import { ConfigApisComponent } from 'app/components/config-apis/config-apis.component';

export const CONFIGURACIONES_ROUTES: Routes = [
  // your root here is /settings/
  {
    path: 'stores',
    component: ConfigStoreComponent,
    canActivate: [AuthGuardService],
    children: CONFIG_TIENDAS_ROUTES
  },
  {
    path: 'regions',
    component: ConfigRegionsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'regions/:nuevo',
    component: ConfigRegionsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'usuarios',
    component: ConfigUsuariosComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'apis',
    component: ConfigApisComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'general',
    component: ConfigGeneralComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'status',
    component: ConfigStatusComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'splash-page',
    component: StepperSplashComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'usuarios'
  }
]
