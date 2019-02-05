// basic for testing
import {
    inject, TestBed, getTestBed
} from '@angular/core/testing';
// basic for testing services
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { Observable } from 'rxjs/Observable';

// services
import { CategoriesService } from '../../services/categories.service';
import { Category } from 'app/classes/category';
import { BaseURL } from 'app/classes/baseURL';

const baseURL = new BaseURL();
const apiURL = baseURL.getURL() + '/categories';

const makeCategoryData = () => [
    {
        categoryId: 1,
        name: 'Computers',
        createdOn: new Date(),
        categoryTypeId: 1,
        idinCustomerDB: 'C01T01'
    },
    {
        categoryId: 2,
        name: 'Kitchen',
        createdOn: new Date(),
        categoryTypeId: 1,
        idinCustomerDB: 'C02T01'
    }
] as Category[];

////////  Tests  /////////////
describe('CategoriesService', () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CategoriesService]
        });
        injector = getTestBed();
        httpMock = TestBed.get(HttpTestingController);
    });

    it('can instantiate service when inject service',
        inject([CategoriesService], (service: CategoriesService) => {
            expect(service instanceof CategoriesService).toBe(true);
        }));

    describe('when getApiTypes', () => {
        let fakeCategories: Category[];
        let categoriesService: CategoriesService;

        beforeEach(() => {
            fakeCategories = makeCategoryData();
            categoriesService = TestBed.get(CategoriesService);
        });

        it('should have expected fake categories (Observable.do)', () => {
            categoriesService.getCategories()
                .do(categories => {
                    expect(categories.length).toBe(fakeCategories.length,
                        'should have expected no. of categories');
                });
        });

        it('should call the correct URL', () => {
            categoriesService.getCategories().subscribe();
            httpMock.expectOne(apiURL).flush(fakeCategories);
            httpMock.verify();
        });
    });

});
