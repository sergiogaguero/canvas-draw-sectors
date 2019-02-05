import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Role } from '../../classes/role';
import { Constants } from '../../classes/constants';

export class RolesServiceStub {
    roles: Role[] = [
        {
            roleId: 1,
            name: Constants.roles.admin
        },
        {
            roleId: 2,
            name: Constants.roles.regionMgr
        },
        {
            roleId: 3,
            name: Constants.roles.storeMgr
        },
        {
            roleId: 1,
            name: Constants.roles.associate
        }
    ];

    getRoles() {
        return Observable.of(this.roles)
    }
}
