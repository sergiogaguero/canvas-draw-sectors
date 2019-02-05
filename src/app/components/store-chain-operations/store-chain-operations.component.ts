import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BaseURL } from '../../classes/baseURL';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {merge} from 'rxjs/observable/merge';

import * as moment from 'moment';
import { Constants } from '../../classes/constants';

import {MatTableDataSource, MatSort, Sort} from '@angular/material';
import { PercentPipe } from '@angular/common';
import { FormatPipe } from '../../pipes/format.pipe';
// services
import { RegionsService } from '../../services/regions.service';
import { UserService } from '../../services/user.service';
import { KpisService } from '../../services/kpis.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-store-chain-operations',
  templateUrl: './store-chain-operations.component.html',
  styleUrls: ['./store-chain-operations.component.scss',
              '../../styles/noDataError.style.scss']
})
export class StoreChainOperationsComponent implements OnInit {

  canSelectRegion: boolean;
  canSelectStore: boolean;
  regiones: any [] = [];
  loading: boolean;
  notRegions: boolean;
  notStores: boolean;

  selectedRegion: any = -1;
  selectedStore: any = -1;


  // Calendar
  yesterday: any;
  startDate: any = null;
  endDate: any = null;
  currentlySelectedPeriod: string;
  wholeMonth: boolean;
  today: any;

  // KPIs
  cockpitSusbscription: Subscription;
  contentExist = true;
  salesTotal: any []=[];
  ticketPromedioTotal: any []=[];
  uptTotal: any []=[];
  displayedColumnsSales = ['position', 'nombre','amount'];
  displayedColumnsTicket = ['position', 'nombre','amount'];
  displayedColumnsUpt = ['position', 'nombre','qty'];
  unitSales: String;
  unitTicket: String;
  unitUpt: String;
  data : any = {
    sales: {
      dataSource : new MatTableDataSource(),
      ascendente: true,
      stores: []
    },
    ticket: {
      dataSource : new MatTableDataSource(),
      ascendente: true,
      stores: []
    },
    upt: {
      dataSource : new MatTableDataSource(),
      ascendente: true,
      stores: []
    }
  }
  // permission handling
  roleName = '';
  menuVisibility: any = {
    '/settings/stores/add': false,
    '/settings/stores/:id': false,
    '/settings/regions': false
  };


  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService,
              private authService: AuthService,
              private regionsService: RegionsService,
              private kpisService: KpisService) {}

  ngOnInit() {
    this.loading = true;
    this.setCurrentDate();
    this.getDataStoreChain();
  }

  ngAfterViewInit() {
      this.data['sales'].dataSource.sort = this.sort;
      this.data['ticket'].dataSource.sort = this.sort;
      this.data['upt'].dataSource.sort = this.sort;
  }


  getDataStoreChain( ) {
    return this.userService.getDetailUser().subscribe(response => {
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
            if (this.regiones.length > 0) {
              this.canSelectRegion = this.regiones.length > 1;
              this.canSelectStore = this.regiones.length > 1 || this.regiones[0].stores.length > 1;
              this.notRegions = this.regiones.length === 0;
              if (!this.canSelectRegion) {
                this.selectedRegion = this.regiones[0];
              }
            }else {
              this.canSelectRegion = false;
              this.canSelectStore = false;
              this.notStores = true;
              this.notRegions = true;
            }
            this.getKpis();
          });
    });
  }

  invertirRanking(kpi){
    this.data[kpi].dataSource =new MatTableDataSource(this.data[kpi].stores.reverse());
    this.data[kpi].ascendente = !this.data[kpi].ascendente;
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
    if ( this.startDate.month() === this.endDate.month() &&
         this.startDate.date() === moment(this.startDate).startOf('month').date() &&
         (this.endDate.isSame(this.yesterday) || this.endDate.date() === moment(this.endDate).endOf('month').date())) {
           this.currentlySelectedPeriod = this.startDate.format('MMMM YYYY');
           return true;
    }
    return false;
  }

  updateRegion () {
    this.selectedStore = -1;
    this.getKpis();
  }

  getKpis() {
    this.data.sales.ascendente = true;
    this.data.ticket.ascendente = true;
    this.data.upt.ascendente = true;
    if (this.cockpitSusbscription) {
      this.cockpitSusbscription.unsubscribe();
    }
    this.loading = true;
    this.notStores =  this.selectedRegion !== -1 && this.selectedRegion.stores.length === 0;
    if (this.notStores) {
      return;
    }
    this.wholeMonth = this.isWholeMonth();
    const params = {
            regionId: this.selectedRegion.regionId ,
            startingDate : this.startDate.format('YYYY-MM-DD'),
            endingDate: this.endDate.format('YYYY-MM-DD'),
          };
    this.cockpitSusbscription = this.kpisService.getKpisChainOperations(params).subscribe(
      response => {
        if (response && response.status === Constants.HTTP_STATUS.OK) {
          this.salesTotal = response.body.sales.total;
          this.ticketPromedioTotal =response.body.ticketsProm.total;
          this.uptTotal = response.body.upt.total;
          this.data['sales'].stores = response.body.sales.stores;
          this.data['ticket'].stores = response.body.ticketsProm.stores;
          this.data['upt'].stores = response.body.upt.stores;
          this.data['sales'].dataSource =new MatTableDataSource(this.data['sales'].stores);
          this.data['ticket'].dataSource  = new MatTableDataSource(this.data['ticket'].stores);
          this.data['upt'].dataSource  =  new MatTableDataSource(this.data['upt'].stores);
          this.unitSales = this.getMenorUnidad(this.data['sales'].stores, 'amount');
          this.unitTicket = this.getMenorUnidad(this.data['ticket'].stores, 'amount');
          this.unitUpt =this.getMenorUnidad(this.data['upt'].stores, 'qty');
          this.loading = false;
          this.contentExist = true;
        }else if (response.status === Constants.HTTP_STATUS.NO_CONTENT) {
          this.contentExist = false;
          this.loading = false;
        }
      }
    );
  }

  getMenorUnidad(data: any[], amountField:string){
    let min = Math.min.apply(null, data.map(stores => stores[amountField]));
    if (min === 0){
      return '';
    }
    let exp = Math.floor(Math.log10(min));
    const unit = Constants.UNITS[`${Math.floor(exp/3)}`];
    return unit !== undefined ? unit : Constants.UNITS['default'];
  }


}
