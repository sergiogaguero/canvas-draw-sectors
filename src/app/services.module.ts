import { NgModule } from '@angular/core';

import { SettingsService } from './services/settings.service';
import { ApiTypesService } from './services/apiTypes.service';
import { AuthService } from './services/auth.service';
import { CompaniesService } from './services/companies.service';
import { CategoriesService } from './services/categories.service';
import { FloorsService } from './services/floors.service';
import { KpisService } from './services/kpis.service';
import { LanguagesService } from './services/languages.service';
import { MapsService } from './services/maps.service';
import { RegionsService } from './services/regions.service';
import { RolesService } from './services/roles.service';
import { StoresService } from './services/stores.service';
import { TokensService } from './services/tokens.service';
import { UserService } from './services/user.service';
import { ProcessingStatusService } from './services/processingStatus.service';
import { SplashPageService } from './services/splashPage.service';


@NgModule({
    providers: [
        // KEEP THE ALPHABETICAL ORDER GOIN', GUYS!
        ApiTypesService,
        AuthService,
        CompaniesService,
        CategoriesService,
        FloorsService,
        KpisService,
        LanguagesService,
        MapsService,
        RegionsService,
        RolesService,
        SettingsService,
        StoresService,
        TokensService,
        RolesService,
        UserService,
        ProcessingStatusService,
        SplashPageService
    ]
})
export class ServicesModule { }
