// angular basics
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSortable } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import * as moment from 'moment';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { DecimalPipe } from '@angular/common';

// services
import { AuthService } from '../../services/auth.service';
import { RegionsService } from '../../services/regions.service';
import { KpisService } from '../../services/kpis.service';
import { StoresService } from '../../services/stores.service';
import { UserService } from '../../services/user.service';

// classes
import { Store } from '../../classes/store';
import { Constants } from '../../classes/constants';

@Component({
  selector: 'app-salesforce',
  templateUrl: './salesforce.component.html',
  styleUrls: [
    './salesforce.component.scss',
    '../../styles/noDataError.style.scss'
  ]
})
export class SalesforceComponent implements OnInit, AfterViewChecked {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  store: Store;
  region: any;
  totals: any;
  userRole: string;

  allStores: Store[] = [];
  stores: Store[];
  currentStore = -1;
  regions: any[];
  currentRegion = -1;
  noRegionError = false;
  noStoreError = false;

  // date handling
  currentlySelectedPeriod: string;
  yesterday: any;
  periodEndingDate: any;
  periodStartingDate: any;
  today: any;
  cantDaysSelectPeriod: number;

  displayedColumns = ['associate', 'prodDays', 'qTickets', 'upt', 'averageTicket', 'sales'];
  dataSource = new MatTableDataSource<any>();

  // permissions
  menuVisibility: any = {
    '/settings/stores/add': false,
    '/settings/stores/:id': false,
    '/settings/stores/:id/floors/:id': false,
    '/settings/regions': false
  };
  roles = Constants.getRoles();

  constructor(
    private _authService: AuthService,
    private _regionsService: RegionsService,
    private _salesforceService: KpisService,
    private _storesService: StoresService,
    private _usersService: UserService
  ) { }

  ngOnInit() {
    this.setCurrentDate();
    this.getUserRole();
  }

  ngAfterViewChecked() {
    if (!this.noStoreError && !this.noRegionError && !this.dataSource.sort
      && this.totals !== undefined && this.totals.salesforce.length > 0) {
      this.sort.sort(<MatSortable>{
        id: 'sales',
        start: 'desc'
      });
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  // get the current user's role
  getUserRole() {
    const userId = this._authService.getLoggedInUser();
    this._usersService.getDetailUser(userId).subscribe(account => {
      this.userRole = account[0].role.name;
      const accountId = account[0].accountId;
      // check what links the user can see where there's no regions, stores, etc
      for (const menu in this.menuVisibility) {
        if (menu != null) {
          this._authService.isRoleAuthorized(this.userRole, menu).then(response => {
            this.menuVisibility[menu.toString()] = response;
          });
        }
      }
      switch (this.userRole) {
        case Constants.roles.admin:
          this.getRegionalData();
          this._storesService.getStores().subscribe(stores => {
            if (stores.length > 0) {
              this.allStores = stores;
              this.stores = this.allStores;
            } else {
              this.noStoreError = true;
            }
          });
          break;

        case Constants.roles.regionMgr:
          this._regionsService.getRegionByManager(accountId).subscribe(regions => {
            if (regions !== undefined) {
              this.region = regions;
              this.currentRegion = regions.regionId;
              this._storesService.getStores().subscribe(stores => {
                if (stores.length > 0) {
                  this.allStores = stores;
                  this.stores = stores;
                  this.getStoreData();
                } else {
                  this.noStoreError = true;
                }
              });
            } else {
              this.noRegionError = true;
            }
          });
          break;
        case Constants.roles.storeMgr:
          this._storesService.getStoreByManager(accountId).subscribe(stores => {
            if (stores !== undefined) {
              this.store = stores;
              this.region = stores.region;
              this.currentStore = this.store.storeId;
              this.getStoreData();
            } else {
              this.noStoreError = true;
            }
          });
          break;
      }
    });
  }

  setCurrentDate() {
    this.yesterday = moment().subtract(1, 'days').startOf('day');
    this.periodEndingDate = this.yesterday;
    this.periodStartingDate = moment().startOf('month');
    this.today = moment().startOf('day');
    if (this.today.format() === this.periodStartingDate.format()) {
        this.periodStartingDate = moment().startOf('month').subtract(1, 'month');
    }
    this.currentlySelectedPeriod = moment().format('MMMM YYYY');
    this.cantDaysSelectPeriod = this.periodEndingDate.diff(this.periodStartingDate,'days');
  }

  getStoreData() {
    if (this.currentStore !== -1) {
      this._salesforceService
        .getSalesforceByStore(this.currentStore, this.periodStartingDate, this.periodEndingDate)
        .subscribe(response => {
          this.totals = response;
          this.dataSource.data = this.totals.salesforce;
        });
    } else {
      this.getRegionalData();
    }
  }

  changePeriod() {
    this.currentlySelectedPeriod = this.periodStartingDate.format('D MMMM YYYY') + ' - ' + this.periodEndingDate.format('D MMMM YYYY');
    this.cantDaysSelectPeriod = this.periodEndingDate.diff(this.periodStartingDate,'days') + 1;
    this.getStoreData();
  }

  getRegionalData() {
    if (this.currentRegion === -1) {
      this._salesforceService.getSalesforceByTennant(this.periodStartingDate, this.periodEndingDate)
        .subscribe(kpis => {
          this.totals = kpis;
          this.dataSource.data = this.totals.salesforce;
          this._regionsService.getRegions().subscribe(regions => {
            if (regions.length > 0) {
              this.regions = regions;
            } else {
              this.noRegionError = true;
            }
          });
        });
    } else {
      this._salesforceService.getSalesforceByRegion(this.currentRegion, this.periodStartingDate, this.periodEndingDate)
        .subscribe(kpis => {
          this.totals = kpis;
          this.dataSource.data = this.totals.salesforce;
          if (this.allStores.length > 0) {
            this.stores = this.allStores.filter(s => s.regionId === this.currentRegion);
            if (this.stores.length > 0) {
              this.noStoreError = false;
            } else {
              this.noStoreError = true;
            }
          }
        });
    }
  }

}
