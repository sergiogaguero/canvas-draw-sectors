import { Routes } from '@angular/router';
import { ReportVisitorsComponent } from '../../components/report-visitors/report-visitors.component';

// Servicios
import { AuthGuardService } from 'app/guards/auth-guard.service';

export const REPORTES_ROUTES: Routes = [
    {
        path: 'visitors',
        component: ReportVisitorsComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'visitors'
    }
]
