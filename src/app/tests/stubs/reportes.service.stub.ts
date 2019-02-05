import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class ReportsServiceStub {
    visitorsPerDay = [];
    averageDwellTime = [];

    getVisitantesPorDia(store: string, dateFrom: string, dateTo: string): Observable<any[]> {
        return Observable.of(this.visitorsPerDay);
    }

    getDwellTimePromedio(store: string, dateFrom: string, dateTo: string): Observable<any[]> {
        return Observable.of(this.averageDwellTime);
    }
}
