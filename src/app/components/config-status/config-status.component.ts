// Angular basics
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA,
    MatTableDataSource
} from '@angular/material';

// Services
import { ProcessingStatusService } from '../../services/processingStatus.service';
import { CompaniesService } from '../../services/companies.service';

// Components
import { OpenMessageDialog } from '../message-dialog/message-dialog.component';

// Classes
import { Pattern } from '../../classes/patterns';
import { User } from '../../classes/user';
import { Constants } from '../../classes/constants';
import { Role } from '../../classes/role';

// Project Basics
import * as moment from 'moment';

@Component({
    selector: 'app-config-status',
    templateUrl: './config-status.component.html',
    styleUrls: [
        './config-status.component.scss',
        '../../styles/headerBar.style.scss',
        '../../styles/table.style.scss'
    ]
})
export class ConfigStatusComponent implements OnInit {

    companies = [];
    stores = [];
    displayedColumns = ['store', 'qInvoices', 'qVisitors'];
    dataSource = new MatTableDataSource<any>(this.stores);
    loading = true;

    maxDate = moment().subtract(1, 'days');
    dateDefault: any;
    formatDate: any;

    constructor(
        public dialog: MatDialog,
        public _processingStatusService: ProcessingStatusService,
        public _companiesService: CompaniesService
    ) { }

    ngOnInit() {
        this.dateDefault = this.maxDate;
        this.updateStatus();
        this.getCompany();
    }

    updateStatus() {
        this.formatDate = this.dateDefault.format('YYYY-MM-DD');
        this.getStores(this.formatDate);
    }

    getStores(date: string) {
        this._processingStatusService.getStoresStatus(date).subscribe(
            response => {
                if (response) {
                    this.stores = response;
                    this.dataSource = new MatTableDataSource<any>(this.stores);
                    this.loading = false;
                }
            }
        );
    }

    getCompany() {
        this._companiesService.getCompanies().subscribe(
            response => {
                if (response) {
                    this.companies = response;
                }
            }
        )
    };
}



