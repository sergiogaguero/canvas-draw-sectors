// angular basics
import {
    Component,
    Inject,
    OnInit
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatTableDataSource
} from '@angular/material';

export interface Element {
    apiTypeId: number;
    label: string;
    token: string;
    tokenId: string;
}

// services
import { ApiTypesService } from '../../services/apiTypes.service';
import { TokensService } from '../../services/tokens.service';

// components
import { OpenMessageDialog } from '../message-dialog/message-dialog.component';
import { Constants } from '../../classes/constants';


// component definitions
@Component({
    selector: 'app-config-apis',
    templateUrl: './config-apis.component.html',
    styleUrls: [
        './config-apis.component.scss',
        '../../styles/headerBar.style.scss',
        '../../styles/table.style.scss',
        '../../styles/noDataError.style.scss'
    ]
})

export class ConfigApisComponent implements OnInit {
    displayedColumns = ['apiTypeId', 'label', 'token', 'active'];
    tokens: any[] = [];
    dataSource = new MatTableDataSource<Element>(this.tokens);

    constructor(
        public dialog: MatDialog,
        private _tokensService: TokensService
    ) { }

    ngOnInit() {
        this.getTokens();
    }


    // THIS METHOD OPENS THE NEW TOKEN DIALOG
    newTokenDialog(): MatDialogRef<NewTokenDialog> {
        // sets up a variable to keep an eye on the dialog
        const dialogRef = this.dialog.open(NewTokenDialog, {
            // you gotta send a width and a basic object with any data you want showed in the dialog
            width: Constants.dialogWidth,
            data: { label: '', apiTypeId: null }
        });

        // and subscribes to its closing event to do shit with the data
        dialogRef.afterClosed().subscribe(result => this.addToken(result));
        return dialogRef;
    }

    addToken(token: any): void {
        if (token !== undefined && token !== null) {
            // i create a token and then update the table with all tokens
            this._tokensService.addToken(token).subscribe(response => {
                this.getTokens();
            });
        }
    }


    // THIS METHOD OPENS THE DELETE TOKEN DIALOG
    deleteTokenDialog(token: any): MatDialogRef<DeleteTokenDialog> {
        const dialogRef = this.dialog.open(DeleteTokenDialog, {
            width: Constants.dialogWidth,
            data: {
                label: token.label,
                id: token.id
            }
        });

        dialogRef.afterClosed().subscribe(
            result => this.deleteToken(result));
        return dialogRef;
    };

    deleteToken(token: any): void {
        if (token !== undefined && token !== null) {
            this._tokensService.deleteToken(token.id).subscribe(response => {
                this.getTokens();
            });
        }
    }


    getTokens() {
        this._tokensService.getTokens().subscribe(response => {
            this.tokens = response;
            this.dataSource = new MatTableDataSource<Element>(this.tokens);
        });
    }
}

// NEW TOKEN DIALOG CONSTRUCTOR
@Component({
    selector: 'new-token-dialog',
    styleUrls: [
        'config-apis.component.scss',
        '../../styles/dialog.style.scss'
    ],
    // refers to another html template in the same folder
    templateUrl: 'new-token-dialog.component.html',
})
export class NewTokenDialog {
    apiTypeFormControl = new FormControl('', [
        Validators.required
    ]);
    labelFormControl = new FormControl('', [
        Validators.required
    ]);

    addToken = new FormGroup({
        'apiType': this.apiTypeFormControl,
        'label': this.labelFormControl
    });

    apiTypes: any[];

    constructor(
        public dialogRef: MatDialogRef<NewTokenDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _apiTypesService: ApiTypesService
    ) {
        this._apiTypesService.getApiTypes().subscribe(response => this.apiTypes = response);
    }

    saveToken() {
        if (this.addToken.valid) {
            this.dialogRef.close(this.data);
        } else {
            // validate all form fields
            Object.keys(this.addToken.controls).forEach(field => {
                const control = this.addToken.get(field);
                control.markAsTouched({ onlySelf: true });
            });
        }
    }

    // when you click cancel, the dialog should get closed
    onNoClick(): void {
        this.dialogRef.close();
    }
}

// DELETE TOKEN DIALOG CONSTRUCTOR
@Component({
    selector: 'delete-token-dialog',
    styleUrls: [
        'config-apis.component.scss',
        '../../styles/dialog.style.scss'
    ],
    templateUrl: 'delete-token-dialog.component.html',
})
export class DeleteTokenDialog {

    constructor(
        public dialogRef: MatDialogRef<DeleteTokenDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    // when you click cancel, the dialog should get closed
    onNoClick(): void {
        this.dialogRef.close();
    }
}