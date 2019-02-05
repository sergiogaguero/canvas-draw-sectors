// project basics
import { By, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MaterialModule } from '../../material.module';
import { DebugElement } from '@angular/core';

// Testing basics
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async } from '@angular/core/testing';

// component
import {
    ConfigUsuariosComponent,
    AddUserDialog,
    DeleteUserDialog
} from '../../components/config-usuarios/config-usuarios.component';

// service & stub :)
import { UserService } from '../../services/user.service';
import { UserServiceStub } from '../stubs/user.service.stub';


// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { MessageDialog } from '../../components/message-dialog/message-dialog.component';
import { RolesService } from '../../services/roles.service';
import { RolesServiceStub } from '../stubs/roles.service.stub';
const translationsMock = {
    'config': {
        'user': {
            'users': 'Users',
            'listUsersExist': 'Users Listing',
            'newUser': 'New User',
            'role': 'Role',
            'email': 'Email',
            'listUser': 'Users Listing',
            'createUser': 'Create User',
            'firstName': 'First name',
            'lastName': 'Last name',
            'selectRole': 'Select role',
            'editUser': 'Edit User',
            'alertDeleteUser': 'You are about to delete the user',
            'resetPass': 'Reset password',
            'attention': 'Warning',
            'alertResetPass1': 'If you confirm the action, an email will be sent to',
            'alertResetPass2': 'with a link for reseting the password',
            'confirm': 'Confirm',
            'messageNameUser': 'Please, enter the user name',
            'messageRolUser': 'Please, select a role',
            'messageLastNameUser': 'Please, enter the user last name',
            'messageEmail': 'Please, enter the user email',
            'messageEmailIncorrect': 'Please, enter a valid email',
            'selectRegion': 'Select the region',
            'messageRegion': 'Please, select a region',
            'selectStore': 'Select store',
            'messageStore': 'Please, select a store',
            'deleteUser': 'Delete user',
            'hintIdCustomerDb': 'Associate ID in your billing system',
            'userCreate': 'User Created',
            'userCreatMessage': 'The user was created successfully.',
            'userEdit': 'User edited',
            'userEditMessage': 'The changes were saved correctly.',
            'errorSave': 'Error when saving',
            'errorMessageUser': 'There was a problem when saving the user.  Please, try again.',
            'userDelete': 'User deleted',
            'userDeleteMessage': 'The user was deleted successfully.',
            'errorDelete': 'Error when deleting',
            'errorDeleteMessage': 'The user could not be deleted because it has a region or a store associated.',
            'wrongNameError': 'First name only accepts letters',
            'wrongLastnameError': 'Last name only accepts letters'
        },
    },
    'general': {
        'cancel': 'Cancel',
        'save': 'Save',
        'accept': 'Accept',
        'delete': 'Delete',
    }
};
class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of(translationsMock);
    }
}


describe('ConfigUsuariosComponent ', () => {
    let comp: ConfigUsuariosComponent;
    let fixture: ComponentFixture<ConfigUsuariosComponent>;
    let _usersService: UserService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfigUsuariosComponent,
                AddUserDialog,
                DeleteUserDialog,
                MessageDialog
            ],
            imports: [
                MaterialModule,
                FormsModule,
                BrowserModule,
                ReactiveFormsModule,
                BrowserAnimationsModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: FakeLoader },
                })
            ], providers: [
                { provide: UserService, useClass: UserServiceStub },
                { provide: RolesService, useClass: RolesServiceStub }
            ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [
                    AddUserDialog,
                    DeleteUserDialog,
                    MessageDialog
                ]
            }
        });
        TestBed.compileComponents();
        _usersService = TestBed.get(UserService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigUsuariosComponent);

        comp = fixture.componentInstance; // test instance
    });

    it('should call getUsers when onInit()', () => {
        spyOn(comp, 'getUsers');
        expect(comp.loading).toBeTruthy();
        fixture.detectChanges();
        expect(comp.getUsers).toHaveBeenCalled();
    });

    it('should call userService on getUsers()', () => {
        spyOn(_usersService, 'getUsers').and.returnValue(Observable.of([]));
        comp.getUsers();
        expect(_usersService.getUsers).toHaveBeenCalled();
        expect(comp.loading).toBeFalsy();
    });

    describe('when adding a user', () => {
        it('should open the dialog when openNewUserDialog()', () => {
            const dialogRef = comp.openNewUserDialog();
            fixture.detectChanges();
            expect(dialogRef.componentInstance instanceof AddUserDialog).toBe(true);
            expect(dialogRef.componentInstance.data.accountId).toBeNull();
            expect(dialogRef.componentInstance.data.name).toBe('');

            dialogRef.componentInstance.createUser();
            fixture.detectChanges();
            expect(dialogRef.componentInstance.userToCreate.valid).toBeFalsy();
        });

        it('createUser() should create the user', () => {
            const user = {
                accountId: 1,
                name: 'Kermit',
                lastname: 'Frog',
                email: 'kermit@muppets.com',
                roleId: 1
            };
            const dialogRef = comp.openNewUserDialog();
            dialogRef.componentInstance.data = user;
            spyOn(_usersService, 'createUser').and.returnValue(Observable.of(user));
            fixture.detectChanges();
            dialogRef.componentInstance.createUser();
            expect(_usersService.createUser).toHaveBeenCalled();
        });
    });


    describe('when editing a user', () => {
        let user;
        beforeEach(() => {
            user = {
                accountId: 1,
                name: 'Kermit',
                lastname: 'Frog',
                roleId: 1,
                user: {
                    email: 'kermit@muppets.com',
                }
            };
        });
        it('should open the dialog when openNewUserDialog()', () => {
            const dialogRef = comp.openNewUserDialog(user);
            fixture.detectChanges();
            expect(dialogRef.componentInstance instanceof AddUserDialog).toBe(true);
            expect(dialogRef.componentInstance.data.accountId).toBe(user.accountId);
            expect(dialogRef.componentInstance.data.name).toBe(user.name);

            fixture.detectChanges();
            expect(dialogRef.componentInstance.userToCreate.valid).toBeTruthy();
        });

        it('editUsuario() should create the user', () => {
            const dialogRef = comp.openNewUserDialog(user);
            fixture.detectChanges();
            spyOn(_usersService, 'updateUser').and.returnValue(Observable.of(user).toPromise());
            dialogRef.componentInstance.editUsuario();
            expect(_usersService.updateUser).toHaveBeenCalled();
        });
    });


    describe('when delete a user', () => {
        let user;
        beforeEach(() => {
            user = {
                accountId: 1,
                name: 'Kermit',
                lastname: 'Frog',
                email: 'kermit@muppets.com',
                roleId: 1
            };
        });
        it('should open the dialog when openDeleteUser()', () => {
            const dialogRef = comp.openDeleteUserDialog(user);
            fixture.detectChanges();
            expect(dialogRef.componentInstance instanceof DeleteUserDialog).toBe(true);
            expect(dialogRef.componentInstance.data.accountId).toBe(user.accountId);
            expect(dialogRef.componentInstance.data.name).toBe(user.name);

            fixture.detectChanges();
        });

        it('deleteUser() should delete the user', () => {
            const dialogRef = comp.openDeleteUserDialog(user);
            fixture.detectChanges();
            spyOn(_usersService, 'deleteUser').and.returnValue(Observable.of(user).toPromise());
            dialogRef.componentInstance.deleteUser();
            expect(_usersService.deleteUser).toHaveBeenCalledWith(user.accountId);
        });
    });

});
