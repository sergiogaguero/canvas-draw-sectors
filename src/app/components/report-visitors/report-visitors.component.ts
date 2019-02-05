// angular basics
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

// project basics
import * as moment from 'moment';

// Services
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { RegionsService } from 'app/services/regions.service';
import { StoresService } from 'app/services/stores.service';
import { FloorsService } from 'app/services/floors.service';
import { MapsService } from 'app/services/maps.service';
import { KpisService } from '../../services/kpis.service';
import { Region } from 'app/classes/region';
import { Constants } from 'app/classes/constants';



@Component({
    selector: 'app-report-visitors',
    templateUrl: './report-visitors.component.html',
    styleUrls: [
        './report-visitors.component.scss',
        '../../styles/noDataError.style.scss'
    ],
})

export class ReportVisitorsComponent implements OnInit {
    loading = true;

    barChartLabels: string[] = [];
    barChartDataVisit: any[] = [{
        data: [0],
        label: 'none'
    }];
    barChartDataDwell: any[] = [{
        data: [0],
        label: 'none'
    }];
    regions: Region[] = [];
    selectedRegion = -1;
    roleName: string;
    accountId: number;


    currentlyShownMonth = moment();
    today = moment();

    reportSubscription: Subscription;

    barChartLegend = true;
    barChartOptions: any = {
        scaleShowVerticalLines: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontSize: 12
                }
            }],
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontSize: 10
                }
            }]
        }
    };

    // possible errors due to missing info
    noRegionsError = false;
    noStoresError = false;
    noFloorsError = false;
    noMapsError = false;
    noDataError = false;

    menuVisibility: any = {
        '/settings/stores/add': false,
        '/settings/stores/:id': false,
        '/settings/stores/:id/floors/:id': false,
        '/settings/regions': false
    };

    constructor(
        private _kpisService: KpisService,
        private _regionsService: RegionsService,
        private _storesService: StoresService,
        private _floorsService: FloorsService,
        private _mapsService: MapsService,
        private _authService: AuthService,
        private _usersService: UserService
    ) { }

    ngOnInit() {
        this.getUsersRole();
    }

    getUsersRole() {
        this._usersService.getDetailUser()
            .subscribe(response => {
                this.accountId = response[0].accountId;
                this.roleName = response[0].role.name;
                this.checkUserPermissions();
                this.checkForBasicSystemInfo();
            });
    }

    checkUserPermissions() {
        // check what links the user can see where there's no regions, stores, etc
        for (const menu in this.menuVisibility) {
            if (menu != null) {
                this._authService.isRoleAuthorized(this.roleName, menu).then(isAuthorized => {
                    this.menuVisibility[menu.toString()] = isAuthorized;
                });
            }
        }
    }

    // validates that all necessary data (regions, stores, floors & maps) exist
    checkForBasicSystemInfo() {
        // validates regions
        this._regionsService.getRegions().subscribe(regions => {

            // if it's an admin or a regional manager, we should save those regions for the dropdown
            switch (this.roleName) {
                case Constants.roles.admin:
                    this.regions = regions;
                    break;
                case Constants.roles.regionMgr:
                    this.regions = regions.filter(r => r.responsableId === this.accountId);
                    break;
            }

            if (
                (this.regions.length === 0 && this.roleName === Constants.roles.regionMgr)
                || regions.length === 0
            ) {
                this.noRegionsError = true;
                this.loading = false;
            } else {
                // validates stores
                this._storesService.getStores().subscribe(stores => {
                    if (stores.length <= 0) {
                        this.noStoresError = true;
                        this.loading = false;
                    } else {
                        // validates floors
                        this._floorsService.getFloors().subscribe(floors => {
                            if (floors.length <= 0) {
                                this.noFloorsError = true;
                                this.loading = false;
                            } else {
                                // validates maps
                                this._mapsService.getMaps().subscribe(maps => {
                                    if (maps.length <= 0) {
                                        this.noMapsError = true;
                                        this.loading = false;
                                    } else {
                                        this.getReportData();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    getReportData() {
        this.loading = true;
        // traemos los datos del backend
        if (this.reportSubscription) {
            this.reportSubscription.unsubscribe();
        }

        if (this.selectedRegion !== -1
            && this.regions.filter(r => r.regionId === this.selectedRegion)[0].stores.length === 0) {
            this.noStoresError = true;
            this.loading = false;
        } else {
            const optionalParams = {};
            if (this.roleName === Constants.roles.storeMgr) {
                optionalParams['storeManager'] = this.accountId;
            } else {
                if (this.selectedRegion === -1 && this.roleName === Constants.roles.regionMgr) {
                    optionalParams['regionManager'] = this.accountId
                } else if (this.selectedRegion > 0) {
                    optionalParams['regionId'] = this.selectedRegion
                }
            }


            this.reportSubscription = this._kpisService
                .getVisitors(
                    this.currentlyShownMonth.format('YYYY'),
                    this.currentlyShownMonth.format('MM'),
                    optionalParams)
                .subscribe(reportData => {
                    // si llegaron datos, los cargo en las variables que usan los charts
                    if (reportData.length > 0) {
                        // reset some variables
                        this.noDataError = false;
                        this.barChartDataDwell = [];
                        this.barChartDataVisit = [];
                        // for every store data recieved, push an item into the chart data arrays
                        for (let i = 0; i < reportData.length; i++) {
                            this.barChartDataDwell.push({
                                label: reportData[i].store,
                                data: reportData[i].averageDwellTimePerDay
                            });

                            this.barChartDataVisit.push({
                                label: reportData[i].store,
                                data: reportData[i].visitsPerDay
                            });
                        }
                        this.getDaysInMonth();
                    } else {
                        this.noDataError = true;
                    }
                    this.loading = false;
                    this.noStoresError = false;
                });
        }
    }

    // carga los labels para el mes en la variable que usa el chart
    getDaysInMonth(): void {
        this.barChartLabels = [];
        for (let index = 1; index <= this.currentlyShownMonth.daysInMonth(); index++) {
            this.barChartLabels.push(
                moment(
                    `${this.currentlyShownMonth.month() + 1}/${index}/${this.currentlyShownMonth.year}`, 'MM/DD/YYYY')
                    .format('ddd D')
            );
        }
    }

    // Mueve el reporte en meses (para adelante o atrás)
    changeMonth(movement: number): void {
        this.currentlyShownMonth.add(movement, 'M');
        this.getReportData();
    }

}
