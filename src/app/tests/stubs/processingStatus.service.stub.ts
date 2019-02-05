import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class ProcessingStatusStub {
    stores =  [
        {
            name: 'tienda 1',
            qtickets: 1,
            qvisitors: 1,
            store_id: 1
        },
        {
            name: 'tienda 2',
            qtickets: 2,
            qvisitors: 2,
            store_id: 2
        },
        {
            name: 'tienda 3',
            qtickets: 3,
            qvisitors: 3,
            store_id: 3
        }
    ] as any[];

    getStoresStatus(date: string): Observable<any> {
        return Observable.of(this.stores);
    }
}