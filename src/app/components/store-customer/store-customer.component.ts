import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
// classes
import { BaseURL } from '../../classes/baseURL';
import { Store } from '../../classes/store';
import { Constants } from '../../classes/constants';

// services
import { StoresService } from '../../services/stores.service';
import { RegionsService } from '../../services/regions.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { KpisService } from '../../services/kpis.service';
import { FloorsService } from '../../services/floors.service';

import * as moment from 'moment';
import { Floor } from 'app/classes/floor';


@Component({
  selector: 'app-store-customer',
  templateUrl: './store-customer.component.html',
  styleUrls: ['./store-customer.component.scss',
    '../../styles/noDataError.style.scss']
})
export class StoreCustomerComponent implements OnInit {
  canSelectRegion = false;
  canSelectStore = false;
  regiones: any[] = [];
  loading: boolean;

  selectedRegion: any = -1;
  selectedStore: any = -1;

  // Calendar
  yesterday: any;
  startDate: any = null;
  endDate: any = null;
  currentlySelectedPeriod: string;
  wholeMonth: boolean;
  today: any;

  // Data cockpit
  captacion: any[] = [];
  fidelizacion: any[] = [];
  conversion: any[] = [];
  cockpitSusbscription: Subscription;
  contentExist = true;

  // Error handling
  noFloorsError = false;
  noMapError = false;
  notRegions = false;
  notStores = false;

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

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private regionsService: RegionsService,
    private kpisService: KpisService,
    private _floorsService: FloorsService) {
  }

  ngOnInit() {
    this.loading = true;
    this.setCurrentDate();
    this.getDataClient360();
  }

  getDataClient360(): void {
    this.userService.getDetailUser().subscribe(response => {
      const account = response[0];
      this.roleName = response[0].role.name;

      // check what links the user can see where there's no regions, stores, etc
      for (const menu in this.menuVisibility) {
        if (menu != null) {
          this.authService.isRoleAuthorized(this.roleName, menu).then(canSee => {
            this.menuVisibility[menu.toString()] = canSee;
          });
        }
      }
      this.regionsService.getRegionsByRole(account)
        .toPromise()
        .then(
          (regions) => {
            this.regiones = regions;
            // if there's any regions
            if (this.regiones.length > 0) {
              this.canSelectRegion = this.regiones.length > 1;
              // if any region has stores
              if (this.regiones.filter(r => r.stores.length > 0).length > 0) {
                this.getCockPit();
              } else {
                this.notStores = true;
              }

              if (!this.canSelectRegion) {
                this.selectedRegion = this.regiones[0];
                this.canSelectStore = this.selectedRegion.stores.length > 1;
                if (this.selectedRegion.stores.length === 1) {
                  this.selectedStore = this.selectedRegion.stores[0];
                }
              }
            } else {
              this.notRegions = true;
              this.loading = false;
              this.contentExist = false;
            }
          });
    });
  }

  setCurrentDate() {
    this.yesterday = moment().subtract(1, 'days').startOf('day');
    this.endDate = this.yesterday;
    this.startDate = moment().startOf('month');
    this.today = moment().startOf('day');
    if (this.today.format() === this.startDate.format()) {
        this.startDate = moment().startOf('month').subtract(1, 'month');
    }
    this.currentlySelectedPeriod = moment().format('MMMM YYYY');
  }

  isWholeMonth() {
    if (this.startDate.month() === this.endDate.month() &&
      this.startDate.date() === moment(this.startDate).startOf('month').date() &&
      (this.endDate.isSame(this.yesterday) || this.endDate.date() === moment(this.endDate).endOf('month').date())) {
      this.currentlySelectedPeriod = this.startDate.format('MMMM YYYY');
      return true;
    }
    return false;
  }

  updateRegion() {
    this.selectedStore = -1;
    this.canSelectStore = false;
    this.notStores = false;
    if (this.selectedRegion !== -1) {
      if (this.selectedRegion.stores.length > 0) {
        this.canSelectStore = true;
        this.getCockPit();
      } else {
        this.notStores = true;
      }
    } else {
      this.getCockPit();
    }
  }

  selectCurrentStore() {
    this.loading = true;
    this.noFloorsError = false;
    this.noMapError = false;
    if (this.selectedStore !== -1) {
      this._floorsService.getFloorsByStore(this.selectedStore).subscribe(response => {
        if (response.length > 0) {
          const withMaps: Floor[] = response.filter(floor => floor.maps.length > 0);

          if (withMaps.length > 0) {
            this.getCockPit();
          } else {
            this.contentExist = true;
            this.noMapError = true;
            this.loading = false;
          }
        } else {
          this.contentExist = true;
          this.noFloorsError = true;
          this.loading = false;
        }

      });
    } else {
      // if no store is selected but there's a region selected and there's stores,
      // i've gotta check if the stores have floors/maps
      if (this.selectedRegion !== -1) {
        for (let i = 0; i < this.selectedRegion.stores.length; i++) {
          this.noFloorsError = true;
          this.noMapError = true;
          this._floorsService.getFloorsByStore(this.selectedRegion.stores[i].storeId).subscribe(floors => {
            if (floors.length > 0) {
              this.noFloorsError = false;
              if (floors.filter(f => f.maps.length > 0).length > 0) {
                this.noMapError = false;
              }
            }
            if (!this.noFloorsError && !this.noMapError && i === (this.selectedRegion.stores.length - 1)) {
              this.getCockPit();
            }
          });
        }
      } else {
        this.getCockPit();
      }
      this.loading = false;
    }
  }

  getCockPit() {
    if (this.cockpitSusbscription) {
      this.cockpitSusbscription.unsubscribe();
    }
    this.loading = true;

    this.wholeMonth = this.isWholeMonth();
    const params: any = {
      startDate: this.startDate.format('YYYY-MM-DD'),
      endDate: this.endDate.format('YYYY-MM-DD')
    };

    if (this.selectedRegion !== -1 && this.roleName === this.roles.admin) {
      params.regionId = this.selectedRegion.regionId;
    }

    if (this.selectedStore !== -1  && this.roleName !== this.roles.storeMgr) {
      params.storeId = this.selectedStore;
    }

    this.cockpitSusbscription = this.kpisService.getCockPit(params).subscribe(
      response => {
        if (response && response.status === Constants.HTTP_STATUS.OK) {
          this.captacion = /^([0-9]+)\.?(.?.?)/g.exec('' + response.body.captacion);
          this.fidelizacion = /^([0-9]+)\.?(.?.?)/g.exec('' + response.body.fidelidad);
          this.conversion = /^([0-9]+)\.?(.?.?)/g.exec('' + response.body.conversion);
          this.loading = false;
          this.contentExist = true;
        } else if (response.status === Constants.HTTP_STATUS.NO_CONTENT) {
          this.contentExist = false;
          this.loading = false;
        }
      }
    );
  }


}
