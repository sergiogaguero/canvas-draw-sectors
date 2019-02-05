// basic for testing
import {
    inject, TestBed
} from '@angular/core/testing';
// basic for testing services
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

// services
import { MapsService } from '../../services/maps.service';


const makeMapData = () => [
    {
        mapId: 1,
        name: 'Map 1',
        startingDate: '2017-12-20T00:00:00.000Z', endingDate: '2017-12-25T00:00:00.000Z',
        floorId: 1,
        width: 20, height: 15,
        guid: 'image.png',
        comments: ''
    },
    {
        mapId: 2,
        name: 'Map 2',
        startingDate: '2017-12-26T00:00:00.000Z', endingDate: null,
        floorId: 1,
        width: 20, height: 15,
        guid: 'image.png',
        comments: ''
    },
    {
        mapId: 3,
        name: 'Map 1',
        startingDate: '2017-12-21T00:00:00.000Z', endingDate: null,
        floorId: 2,
        width: 20, height: 15,
        guid: 'image.png',
        comments: ''
    },
    {
        mapId: 4,
        name: 'Map 1',
        startingDate: '2017-12-24T00:00:00.000Z', endingDate: null,
        floorId: 3,
        width: 20, height: 15,
        guid: 'image.png',
        comments: ''
    }
] as any[];


////////  Tests  /////////////
describe('MapsService', () => {
    let httpMock: HttpTestingController;
    let mapsService: MapsService;
    let fakeMaps: any[];
    let url : string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MapsService]
        });

        httpMock = TestBed.get(HttpTestingController);
        mapsService = TestBed.get(MapsService);
        fakeMaps = makeMapData();
        url = mapsService.blueprintsURL;
    });

    it('can instantiate service when inject service',
        inject([MapsService], (service: MapsService) => {
            expect(service instanceof MapsService).toBe(true);
        }));


    describe('when getMapsByFloor', () => {
        let floorId: number;

        beforeEach(() => {
            floorId = 1;
        });

        it('should have expected fake maps (Observable.do)', () => {
            mapsService.getMapsByFloor(floorId)
                .do(maps => {
                    expect(maps.length).toBe(fakeMaps.filter(m => m.floorId === floorId).length,
                        'should have expected no. of maps');
                });
        });

        it('should be OK returning no maps', () => {
            floorId = 0;
            mapsService.getMapsByFloor(floorId)
                .do(maps => {
                    expect(maps.length).toBe(0,
                        'should have no maps');
                });
        });

    });


    describe('when getMapById', () => {
        let mapId: number;

        beforeEach(() => {
            mapId = 1;
        });

        it('should have expected fake map (Observable.do)', () => {
            mapsService.getMapById(mapId)
                .do(map => {
                    expect(map).toBe(fakeMaps.filter(m => m.mapId === mapId),
                        'should have expected the correct map');
                });
        });

        it('should be OK returning no map', () => {
            mapId = 0;
            mapsService.getMapById(mapId)
                .do(map => {
                    expect(map).toBe(null,
                        'should have no map');
                });
        });
    });


    describe('when getCurrentMapByFloor', () => {
        let floorId: number;

        beforeEach(() => {
            floorId = 1;
        });

        it('should have expected fake map (Observable.do)', () => {
            mapsService.getCurrentMapByFloor(floorId)
                .do(map => {
                    expect(map).toBe(fakeMaps.filter(m => m.endingDate === null && m.floorId === floorId),
                        'should have the correct map');
                });
        });
    });

    describe('when getActiveMapForDate', () => {
        let floorId: number;
        let date: string;

        beforeEach(() => {
            date = '2017-12-21';
            floorId = 1;
        });

        it('should have expected fake map (Observable.do)', () => {
            mapsService.getActiveMapForDate(floorId, date)
                .do(map => {
                    expect(map).toBe(fakeMaps.filter(m => m.endingDate <= date && m.startingDate >= date),
                        'should have the correct map');
                });
        });
    });


    describe('when editMap', () => {
        let mapId: number;

        beforeEach(() => {
            mapId = 1;
        });

        it('should have expected to edit a map', () => {
            const mapName = 'New map name';
            const map = {
                mapId: mapId,
                name: mapName
            }
            mapsService.editMap(map)
                .do(response => {
                    expect(fakeMaps.filter(m => m.mapId === mapId)[0].name).toBe(mapName,
                        'should have expected the map to be edited');
                });
        });
    });


    describe('when addMap', () => {
        let mapId: number;

        it('should have expected to add a map', () => {
            mapId = 5;
            const mapName = 'New map name';
            const map = {
                name: mapName,
                startingDate: new Date(),
                endingDate: null,
                floorId: 4,
                width: 20, height: 15,
                guid: 'image.png',
                comments: ''
            };
            mapsService.addMap(map)
                .do(response => {
                    expect(fakeMaps.filter(m => m.mapId === mapId)[0].name).toBe(mapName,
                        'should have expected the map to be created');
                });
        });
    });

    describe('when deleteMap', () => {
        let mapId: number;

        it('should have expected to delete a map', () => {
            mapId = 2;
            mapsService.deleteMap(mapId)
                .do(response => {
                    expect(fakeMaps.filter(m => m.mapId === mapId).length).toBe(0,
                        'should have expected the map to be deleted');
                });
        });
    });

    it('should call the correct URL on getSectionsByMap()', () => {
        const filter = '/' + fakeMaps[0].mapId + '/?filter={"include":"sectors"}';
        mapsService.getSectionsByMap(fakeMaps[0].mapId).subscribe();
        httpMock.expectOne(url + filter).flush(fakeMaps[0]);
        httpMock.verify();
    });

    it('should call the correct URL on getMaps()', () => {
        mapsService.getMaps().subscribe();
        httpMock.expectOne(url).flush(fakeMaps);
        httpMock.verify();
    });
});
