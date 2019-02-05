import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class KpisServiceStub {

    storeCustomer: any = {
        status: 200,
        body: {
            captacion: 25.2323,
            fidelidad: 0,
            conversion: 0
        }
    }

    kpisStoreOperations: any = {
        'visits': 70,
        'dwellTime': 156,
        'averageTicket': 0,
        'conversion': 0,
        'behaviour': {
            'visits': 1,
            'dwellTime': 1,
            'averageTicket': 0,
            'conversion': 0
        }
    }

    chainStoreOperation: any = {
        status: 200,
        body: {
            sales: {
                total: 984793,
                stores: [
                    {
                        nombre: "hola",
                        region: "Sur",
                        amount: 1000,
                        percentage: 19,
                        position: 1,
                    },
                    {
                        nombre: "chau",
                        region: "Sur",
                        amount: 1000,
                        percentage: 19,
                        position: 2,
                    },
                    {
                        nombre: "asd",
                        region: "Sur",
                        amount: 1000,
                        percentage: 19,
                        position: 3,
                    }
                ]
            },
            ticketsProm: {
                total: 1000,
                stores: [
                    {
                        nombre: "hola",
                        region: "Sur",
                        amount: 1000,
                        position: 1
                    }
                ]
            },
            upt: {
                total: 1000,
                stores: [
                    {
                        nombre: "hola",
                        region: "Sur",
                        qty: 2,
                        position: 1
                    }
                ]
            }
        }
    }

    salesforceKpis: any = {
        'sales': 1111438.72,
        'qTickets': 24,
        'averageTicket': 46309.94666666666,
        'upt': 514.8333333333334,
        'salesforce': [
            {
                'associate': {
                    'firstname': null,
                    'lastname': null,
                    'idinCustomerDB': 'V2141',
                    'accountId': null
                },
                'qTickets': 0,
                'sales': 61.88,
                'averageTicket': 0,
                'upt': 0
            }]
    };

    getSalesforceByTennant(): Observable<any> {
        return Observable.of(this.salesforceKpis);
    }

    getSalesforceByRegion(): Observable<any> {
        return Observable.of(this.salesforceKpis);
    }

    getSalesforceByStore(): Observable<any> {
        return Observable.of(this.salesforceKpis);
    }

    getKpisChainOperations(params): Observable<any> {
        return Observable.of(this.chainStoreOperation);
    }

    getCockPit(params): Observable<any> {
        return Observable.of(this.storeCustomer);
    }

    getKpis(selectedStore: number, formatedDate: Date): Observable<any> {
        return Observable.of(this.kpisStoreOperations);
    }

    getVisitors(year: string, month: string) {
        return Observable.of([]);
    }
}
