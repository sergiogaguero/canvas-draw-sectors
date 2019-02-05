import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Company } from '../../classes/company';

export class CompaniesServiceStub {
    companies: Company[] = [];

    getCompanies() {
        return Observable.of(this.companies)
    }
}
