// Angular basics
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA,
    MatTableDataSource
} from '@angular/material';

// Services
import { UserService } from '../../services/user.service';
import { RolesService } from '../../services/roles.service';

// Components
import { OpenMessageDialog } from '../message-dialog/message-dialog.component';

// Classes
import { Pattern } from '../../classes/patterns';
import { User } from '../../classes/user';
import { Constants } from '../../classes/constants';
import { Role } from '../../classes/role';


@Component({
    selector: 'app-config-usuarios',
    templateUrl: './config-usuarios.component.html',
    styleUrls: [
        './config-usuarios.component.scss',
        '../../styles/headerBar.style.scss',
        '../../styles/table.style.scss'
    ]
})
export class ConfigUsuariosComponent implements OnInit {

    users = [];
    displayedColumns = ['name', 'email', 'role', 'actions'];
    dataSource = new MatTableDataSource<any>(this.users);
    loading = true;

    constructor(
        private userService: UserService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.getUsers();
    }

    getUsers() {
        this.userService.getUsers().subscribe(
            response => {
                if (response) {
                    this.users = response;
                    this.dataSource = new MatTableDataSource<any>(this.users);
                    this.loading = false;
                }
            }
        );
    }

    openNewUserDialog(user?: any): MatDialogRef<AddUserDialog> {
        const userData = {
            accountId: null,
            name: '',
            lastname: '',
            email: '',
            roleId: null,
            idinCustomerDb: '',
            macAddress: ''
        };
        if (user) {
            if (user.salesAssociate !== undefined && user.salesAssociate.length > 0) {
                userData.idinCustomerDb = user.salesAssociate[0].idinCustomerDB;
                userData.macAddress = user.salesAssociate[0].macAddress
            }
            userData.accountId = user.accountId;
            userData.name = user.name;
            userData.lastname = user.lastname;
            userData.email = user.user.email;
            userData.roleId = user.roleId;
        }
        const dialogRef = this.dialog.open(AddUserDialog, {
            width: Constants.dialogWidth,
            data: userData
        });

        dialogRef.afterClosed().subscribe(result => this.getUsers());

        return dialogRef;
    }

    openDeleteUserDialog(user): MatDialogRef<DeleteUserDialog> {
        const dialogRef = this.dialog.open(DeleteUserDialog, {
            width: Constants.dialogWidth,
            data: user
        });

        dialogRef.afterClosed().subscribe(result => this.getUsers());
        return dialogRef;
    }

}




// DIALOG FOR : Add user & Edit user
@Component({
    selector: 'add-user-dialog',
    templateUrl: 'add-user-dialog.html',
    styleUrls: [
        './config-usuarios.component.scss',
        '../../styles/dialog.style.scss'
    ]

})
export class AddUserDialog implements OnInit {

    // form validation
    emailER = Pattern.getEmail();
    nameER = Pattern.getPersonName();

    nameFormControl = new FormControl('', [Validators.required, Validators.pattern(this.nameER)]);
    lastnameFormControl = new FormControl('', [Validators.required, Validators.pattern(this.nameER)]);
    emailFormControl = new FormControl('', [Validators.required, Validators.pattern(this.emailER)]);
    roleIdFormControl = new FormControl('', [Validators.required]);
    idInCustomerDbFormControl = new FormControl('');
    macAddressFormControl = new FormControl('');
    userToCreate: FormGroup;

    initialRoleId: number;

    roleOptions: Role[] = [];
    roleName: string;
    accountId: number;


    constructor(
        public dialogRef: MatDialogRef<AddUserDialog>,
        private userService: UserService,
        private rolesService: RolesService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


    ngOnInit() {
        this.userToCreate = new FormGroup({
            'name': this.nameFormControl,
            'lastname': this.lastnameFormControl,
            'email': this.emailFormControl,
            'roleId': this.roleIdFormControl,
        });

        this.initialRoleId = this.data.roleId;
        this.getRoles();
    }

    createUser(): void {
        if (this.userToCreate.valid) {
            const user = this.getUserData();
            this.userService.createUser(user)
                .toPromise()
                .then(data => {
                    OpenMessageDialog('config.user.userCreate', 'config.user.userCreatMessage', this.dialog);
                    this.dialogRef.close();
                })
                .catch(error => {
                    OpenMessageDialog('config.user.errorSave', 'config.user.errorMessageUser', this.dialog);
                    this.dialogRef.close();
                });
        } else {
            this.validateFormFields();
        }
    }

    editUsuario() {
        if (this.userToCreate.valid) {
            const user = this.getUserData();
            this.userService.updateUser(user, this.data.accountId)
                .then(
                    response => {
                        OpenMessageDialog('config.user.userEdit', 'config.user.userEditMessage', this.dialog);
                        this.dialogRef.close();
                    }).catch(
                        error => {
                            OpenMessageDialog('config.user.errorSave', 'config.user.errorMessageUser', this.dialog);
                            this.dialogRef.close();
                            console.error(status);
                        }
                    );
        } else {
            this.validateFormFields();
        }
    }

    getUserData(): any {
        const user: any = {};
        user.name = this.data.name;
        user.lastname = this.data.lastname;
        user.email = this.data.email;
        user.roleId = this.data.roleId;

        if (this.roleName === Constants.roles.associate) {
            user.idinCustomerDB = this.data.idinCustomerDb;
            if (this.data.macAddress) {
                user.macAddress = this.data.macAddress;
            }
        }

        return user;
    }

    validateFormFields() {
        Object.keys(this.userToCreate.controls).forEach(field => {
            const control = this.userToCreate.get(field);
            control.markAsTouched({ onlySelf: true });
        });
    }

    changeRole() {
        this.roleName = this.roleOptions.find(r => r.roleId === this.data.roleId).name;
    }

    getRoles() {
        this.rolesService.getRoles().subscribe(
            response => {
                if (response) {
                    this.roleOptions = response;
                    this.changeRole();
                }
            }
        );
    }

    getEdit() {
        return this.initialRoleId;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}

// Dialog for deleting users
@Component({
    selector: 'delete-user-dialog',
    templateUrl: 'delete-user-dialog.html',
    styleUrls: ['./config-usuarios.component.scss',
        '../../styles/dialog.style.scss']
})
export class DeleteUserDialog {

    constructor(
        public dialogRef: MatDialogRef<DeleteUserDialog>,
        private userService: UserService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    deleteUser() {
        this.userService.deleteUser(this.data.accountId).then(

            response => OpenMessageDialog('config.user.userDelete', 'config.user.userDeleteMessage', this.dialog),
            error => {}
        );
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
