// Angular Basics
import { Component, OnInit, AfterContentChecked, ViewChild, ElementRef } from '@angular/core';

// Project Basics
import * as moment from 'moment';

// Services
import { AuthService } from '../../services/auth.service';
import { StoresService } from '../../services/stores.service';
import { MapsService } from '../../services/maps.service';
import { UserService } from '../../services/user.service';
import { KpisService } from '../../services/kpis.service';
import { RegionsService } from '../../services/regions.service';
import { FloorsService } from '../../services/floors.service';

// Classes
import { Constants } from '../../classes/constants';
import { Floor } from '../../classes/floor';
import { Store } from '../../classes/store';

@Component({
    selector: 'app-store-operations',
    templateUrl: './store-operations.component.html',
    styleUrls: ['./store-operations.component.scss',
        '../../styles/noDataError.style.scss']
})
export class StoreOperationsComponent implements OnInit, AfterContentChecked {
    @ViewChild('imgPlano') divImagenPlano: ElementRef;
    @ViewChild('kpis') divKpis: ElementRef;

    /* Variables that are shown to the user */
    averageTicket = 0;
    visitsPerDay = 0;
    averageTime = 0;
    conversionToBuyers = 0;
    behaviour: any;


    mapHeight = 300;
    // permission handling
    roleName = '';
    accountId = 0;
    roles = Constants.getRoles();
    menuVisibility: any = {
        '/settings/stores/add': false,
        '/settings/stores/:id': false,
        '/settings/stores/:id/floors/:id': false,
        '/settings/regions': false
    };

    // error handling
    noStoreError = false;
    noFloorsError = false;
    noRegionError = false;
    dataResponse: boolean;

    loading: boolean;

    maxDate = moment().subtract(1, 'days');
    dateDefault: any;

    // Parameters to get map image, variable map
    urlMap = '';

    // Parameters
    storeId: number;
    floors: Floor[] = [];
    regions: any[] = [];
    stores: Store[] = [];
    selectedFloor: Floor;
    showBlueprint = false;

    selectedRegion = 0;
    selectedStore = 0;

    constructor(
        private _authService: AuthService,
        private _storesService: StoresService,
        private _mapsService: MapsService,
        private _userService: UserService,
        private _kpisService: KpisService,
        private _regionsService: RegionsService,
        private _floorsService: FloorsService
    ) {

    }

    ngOnInit() {
        this.dateDefault = this.maxDate;
        this.getUserRole();
    };

    getUserRole() {
        const userId = this._authService.getLoggedInUser();

        this._userService.getDetailUser(userId).subscribe(response => {
            this.loading = true;

            this.accountId = response[0].accountId;

            this.roleName = response[0].role.name;

            // check what links the user can see where there's no regions, stores, etc
            for (const menu in this.menuVisibility) {
                if (menu != null) {
                    this._authService.isRoleAuthorized(this.roleName, menu).then(canSee =>
                        this.menuVisibility[menu.toString()] = canSee
                    );
                }
            }

            switch (this.roleName) {
                case Constants.roles.admin:
                    this.getAdminData();
                    break;
                case Constants.roles.regionMgr:
                    this.getRegionMgrData();
                    break;
                case Constants.roles.storeMgr:
                    this.getStoreMgrData();
                    break;
            }
        });
    };

    // get Data for admin role (AllRegions)
    getAdminData() {
        this._regionsService.getRegions().subscribe(response => {
            this.responseAdminData(response);
        });
    };

    responseAdminData(response: any) {
        if (response.length > 0) {
            this.regions = response;
            this.selectedRegion = response[0].regionId;
            this.noRegionError = false;
            this.selectCurrentRegion();
            this.dataResponse = true;
        } else {
            this.noRegionError = true;
            this.regions = [];
            this.loading = false;
            this.dataResponse = false;
        }
    };

    getRegionMgrData() {
        this._regionsService.getRegionByManager(this.accountId).subscribe(response => {
            this.responseRegionMgrData(response)
        });
    };

    responseRegionMgrData(response: any) {
        if (response !== undefined) {
            this.regions = new Array(response);
            this.selectedRegion = this.regions[0].regionId;
            this.noRegionError = false;
            this.selectCurrentRegion();
            this.dataResponse = true;
        } else {
            this.noRegionError = true;
            this.regions = [];
            this.loading = false;
            this.dataResponse = false;
        }
    };

    getStoreMgrData() {
        this._storesService.getStoreByManager(this.accountId).subscribe(response => {
            this.responseStoreMgrData(response);
        });
    };

    responseStoreMgrData(response) {
        if (response !== null && response !== undefined) {
            this.regions.push(response.region);
            this.stores.push(response);
            this.selectedStore = response.storeId;
            this.noStoreError = false;
            if (response.floors !== undefined && response.floors.length > 0) {
                this.floors = response.floors;
                this.selectCurrentFloor(this.floors[0]);
                this.noFloorsError = false;
            } else {
                response.floors = [];
                this.noFloorsError = true;
                this.loading = false;
            }
            this.updateKpis();
            this.dataResponse = true;
        } else {
            this.noStoreError = true;
            this.floors = [];
            this.loading = false;
            this.dataResponse = false;
        }
    };

    // this functions is called when a region is selected
    // it updates the stores available
    selectCurrentRegion() {
        this.loading = true;
        this._storesService.getStoreByRegionId(this.selectedRegion).subscribe(response =>
            this.responseGetStoreByRegionId(response)
        );
    };

    responseGetStoreByRegionId(response) {
        if (response.length > 0) {
            this.stores = response;
            this.selectedStore = response[0].storeId;
            this.noStoreError = false;
            this.selectCurrentStore();
        } else {
            this.noStoreError = true;
            this.stores = [];
            this.floors = [];
            this.loading = false;
        }
    }

    // this functions is called when a stores is selected
    // it updates the floors available
    selectCurrentStore() {
        this.loading = true;
        this._floorsService.getFloorsByStore(this.selectedStore).subscribe(response =>
            this.responseGetFloorsByStore(response)
        );
    };

    responseGetFloorsByStore(response) {
        if (response.length > 0) {
            this.floors = response;
            this.selectedFloor = response[0];
            this.noFloorsError = false;
        } else {
            this.noFloorsError = true;
            this.floors = [];
            this.loading = false;
        }
        this.updateKpis();
    }

    // this functions is called when a floors is selected
    // it updates the kpis and map available
    selectCurrentFloor(floor: Floor) {
        this.loading = true;
        this.selectedFloor = floor;
        const date = this.dateDefault.format('YYYY-MM-DD');
        if (this.floors.length > 0) {
            this._mapsService.getActiveMapForDate(this.selectedFloor.floorId, date).subscribe(response => {
                if (response !== null && response.guid !== '') {
                    this.urlMap = this._mapsService.getMapUrlByGuid(response.guid);
                } else {
                    this.urlMap = '';
                }
                this.loading = false;
            });
        } else {
            this.noFloorsError = true;
            this.loading = false;
        }

    };

    updateKpis() {
        this.averageTicket = 0;
        this.visitsPerDay = 0;
        this.averageTime = 0;
        this.conversionToBuyers = 0;

        const formatedDate = this.dateDefault.format('YYYY-MM-DD');

        this._kpisService.getKpis(this.selectedStore, formatedDate).subscribe(response => {

            this.visitsPerDay = response.visits;
            this.averageTime = Math.round(response.dwellTime);
            this.conversionToBuyers = (response.conversion).toFixed(2);
            this.averageTicket = Math.round(response.averageTicket);

            this.behaviour = response.behaviour;
            for (const b in this.behaviour) {
                if (this.behaviour[b] !== null) {
                    this.behaviour[b + 'Array'] = new Array(Math.abs(this.behaviour[b]));
                }
            }
            this.selectCurrentFloor(this.selectedFloor);
        });
    };

    ngAfterContentChecked() {
        if (this.divKpis !== undefined && this.divKpis.nativeElement.offsetHeight > this.mapHeight) {
            this.mapHeight = this.divKpis.nativeElement.offsetHeight;
        }
    };

    updateRowHeight() {
        if (this.divImagenPlano !== undefined && this.divImagenPlano.nativeElement.offsetHeight > this.mapHeight) {
            this.mapHeight = this.divImagenPlano.nativeElement.offsetHeight;
        }
    };
};
