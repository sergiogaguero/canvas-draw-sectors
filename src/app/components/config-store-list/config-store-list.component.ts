// angular basics
import { Component, OnInit, Inject, ViewChild, AfterViewChecked } from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MatPaginator,
    MatSort,
    MatSortable,
    MAT_DIALOG_DATA,
    MatTableDataSource
} from '@angular/material';

// components
import { OpenMessageDialog } from '../message-dialog/message-dialog.component';

// services
import { StoresService } from '../../services/stores.service';

// classes
import { Store } from '../../classes/store';
import { Constants } from '../../classes/constants';


@Component({
    selector: 'app-config-store-list',
    templateUrl: './config-store-list.component.html',
    styleUrls: [
        './config-store-list.component.scss',
        '../../styles/headerBar.style.scss',
        '../../styles/table.style.scss',
        '../../styles/noDataError.style.scss'
    ]
})
export class ConfigStoreListComponent implements OnInit, AfterViewChecked {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    tiendas: Store[] = [];
    displayedColumns = ['idinCustomerDB', 'name', 'region', 'responsable', 'floors', 'actions'];
    dataSource = new MatTableDataSource<Store>(this.tiendas);
    loading = true;
    noStoresError = false;

    constructor(
        private _storesService: StoresService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.refreshStores();
    }

    openDeleteStoreDialog(store: Store): MatDialogRef<DeleteStoreDialog> {
        const dialogRef = this.dialog.open(DeleteStoreDialog, {
            width: Constants.dialogWidth,
            data: store
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.deleteStore(result.storeId);
            }
        });
        return dialogRef;
    }

    deleteStore(storeId: number) {
        this._storesService.deleteStore(storeId)
            .subscribe(data => {
                this.refreshStores();
                OpenMessageDialog('config.store.list.deleteSuccessTitle', 'config.store.list.deleteSuccessMessage', this.dialog);
            },
                error => {
                    OpenMessageDialog('config.store.list.deleteErrorTitle', 'config.store.list.deleteErrorMessage', this.dialog);
                });
    }

    refreshStores() {
        this._storesService.getStores()
            .subscribe(stores => {
                this.tiendas = stores;
                this.dataSource = new MatTableDataSource<Store>(this.tiendas);
                this.loading = false;
                if (stores.length === 0) {
                    this.noStoresError = true;
                }
            });
    }

    ngAfterViewChecked() {
        if (this.tiendas.length > 0 && !this.dataSource.sort && !this.noStoresError) {
            this.sort.sort(<MatSortable>{
                id: 'name',
                start: 'asc'
            });
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }
}

@Component({
    selector: 'delete-store-dialog',
    styleUrls: ['../../styles/dialog.style.scss'],
    templateUrl: 'delete-store-dialog.component.html'
})
export class DeleteStoreDialog {

    constructor(
        public dialogRef: MatDialogRef<DeleteStoreDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Store) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
