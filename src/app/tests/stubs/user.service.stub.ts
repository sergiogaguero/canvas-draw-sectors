import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Promise } from 'q';
import { Account } from '../../classes/account';

export class UserServiceStub {
    accounts: Account[] = [
        {
            'accountId': 1,
            'userId': 1,
            'name': 'Sergo',
            'lastname': 'Aguero',
            'email': 'ocpqa@grupoassa.com',
            'roleId': 1,
            'timezone': '2017-08-29T12:12:31.949Z',
            'user': {
                'userId': 1,
                'tenantId': 1,
                'email': 'ocpqa@grupoassa.com',
                'emailVerified': true,
                'langId': 1,
                'language': {
                    'langId': 1,
                    'name': 'Español',
                    'key': 'ES'
                }
            },

            'role': {
                'roleId': 1,
                'name': 'Admin'
            }
        },
        {
            'accountId': 2,
            'userId': 2,
            'name': 'Javier',
            'lastname': 'Coppis',
            'email': 'ocpqa@grupoassa.com',
            'roleId': 3,
            'timezone': null,
            'user': {
                'userId': 47,
                'tenantId': 2,
                'email': 'j@grupoassa.com',
                'emailVerified': true,
                'langId': 1
            },
            'role': {
                'roleId': 3,
                'name': 'GteRed'
            }
        },

        {
            'accountId': 3,
            'userId': 3,
            'name': 'Javier',
            'lastname': 'Coppis',
            'roleId': 2,
            'email': 'ocpqa@grupoassa.com',
            'timezone': null,
            'user': {
                'userId': 47,
                'tenantId': 2,
                'email': 'j@grupoassa.com',
                'emailVerified': true,
                'langId': 1
            },
            'role': {
                'roleId': 2,
                'name': 'GteTienda'
            }
        },
        {
            'accountId': 4,
            'userId': 4,
            'name': 'Javier',
            'lastname': 'Coppis',
            'email': 'ocpqa@grupoassa.com',
            'roleId': 3,
            'timezone': null,
            'user': {
                'userId': 47,
                'tenantId': 2,
                'email': 'j@grupoassa.com',
                'emailVerified': true,
                'langId': 1
            },
            'role': {
                'roleId': 4,
                'name': 'Vendedor'
            }
        },
        {// this user shoult not have langId for testing purpose
            'accountId': 5,
            'userId': 5,
            'name': 'Javier',
            'email': 'ocpqa@grupoassa.com',
            'lastname': 'Coppis',
            'roleId': 3,
            'timezone': null,
            'user': {
                'userId': 47,
                'tenantId': 2,
                'email': 'j@grupoassa.com',
                'emailVerified': true
            },
            'role': {
                'roleId': 3,
                'name': 'GteRed'
            }
        },
    ];

    requestPassword(email: string): Promise<any> {
        // return Observable.of(null).toPromise();
        return Promise(() => {
            return null;
        });
    }

    getUsers(): Observable<any[]> {
        return Observable.of(this.accounts);
    }

    getUsersByRole(roleName: string): Observable<any[]> {
        const filteredAccounts = this.accounts.filter(a => a.role.name === roleName);
        return Observable.of(filteredAccounts);
    }

    getDetailUser(globalUserId: number = 1): Observable<any[]> {
        const foundUser = this.accounts.filter(a => a.userId === globalUserId);
        return Observable.of(foundUser);
    }

    confirmAccount(uid: string, token: string): Promise<any> {
        return Promise(() => {
            return true;
        });
    }

    resetPassword(password: string, token: string): Promise<any> {
        return Promise(() => {
            return true;
        });
    }

    updatelanguageUser(userId: any, langId): Promise<any> {
        return Promise(() => {
            return true;
        })
    }

    createUser(account: Account) {
        account.userId = 1;
        account.accountId = this.accounts.length + 1;
        this.accounts.push(account);
        return Observable.of(account);
    }

    updateUser(account: any, accountId: number) {
        const accountToModify = this.accounts.filter(a => a.accountId === accountId)[0];
        for (const key in account) {
            if (account[key] !== accountToModify[key]) {
                accountToModify[key] = account[key];
            }
        }
        this.accounts = this.accounts.filter(a => a.accountId !== accountId);
        this.accounts.push(accountToModify);
        return Observable.of(accountToModify).toPromise();
    }

    deleteUser(accountId: number) {
        this.accounts = this.accounts.filter(a => a.accountId !== accountId);
        return Observable.of(accountId).toPromise();
    }
}
