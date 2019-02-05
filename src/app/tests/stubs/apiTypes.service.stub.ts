import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class ApiTypesServiceStub {
    apiTypes = [{
        id: 1,
        label: 'sales',
        description: 'POS API'
    },
    {
        id: 2,
        label: 'associates',
        description: 'Employees API'
    }];

    getApiTypes(): Observable<any[]> {
        return Observable.of(this.apiTypes);
    }
}
