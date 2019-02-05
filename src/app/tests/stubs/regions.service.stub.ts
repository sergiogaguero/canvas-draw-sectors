import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Region } from '../../classes/region';

export class RegionsServiceStub {
    regions: Region[] = [
        {
            regionId: 1,
            name: 'Region 1',
            responsableId: 1,
            responsable: {
                name: 'Peter',
                lastname: 'Region',
                accountId: 1
            },
            stores: [
                {
                  storeId: 1,
                  name: "Tumba Muerto",
                  regionId: 1,
                  responsableId: 180,
                  locationLat: "-34.634094",
                  locationLong: "-58.48887179999997",
                  companyId: 1,
                  idinCustomerDB: "KILLROY1",
                  timeZoneOffset: 0,
                  address: ''
                },
                {
                  storeId: 48,
                  name: "ParaNewYear",
                  regionId: 1,
                  responsableId: 111,
                  locationLat: "-34.6246203",
                  locationLong: "-58.409104100000036",
                  companyId: 1,
                  idinCustomerDB: "CuantoFalta",
                  timeZoneOffset: 0,
                  address: ''
                }
              ]
        },
        {
            regionId: 2,
            name: 'Region 2',
            responsableId: 2,
            responsable: {
                name: 'John',
                lastname: 'Region',
                accountId: 2
            },
            stores: []
        }
    ];

    getRegions(): Observable<any[]> {
        return Observable.of(this.regions);
    }

    addRegion(region: Region): Observable<any> {
        region.regionId = this.regions.length + 1;
        region.responsable = {
            name: 'John',
            lastname: 'Region',
            accountId: region.responsableId
        };
        region.stores = [];
        this.regions.push(region);
        return Observable.of(region);
    }

    editRegion(region: Region): Observable<Region> {
        const regionToModify = this.regions.filter(r => r.regionId === region.regionId)[0];
        for (const key in region) {
            if (region[key] !== regionToModify[key]) {
                regionToModify[key] = region[key];
            }
        }
        this.regions = this.regions.filter(r => r.regionId !== region.regionId);
        this.regions.push(regionToModify);
        return Observable.of(regionToModify);
    }

    deleteRegion(regionId: number): Observable<null> {
        this.regions = this.regions.filter(r => r.regionId !== regionId);
        return Observable.of(null);
    }

    getRegionByManager(accountId: number): Observable<Region> {
        const filteredRegions = this.regions.filter(r => r.responsableId === accountId)[0];
        return Observable.of(filteredRegions);
    }

    getRegionsByRole(): Observable<Region[]> {
        return Observable.of(this.regions);
    }
}
