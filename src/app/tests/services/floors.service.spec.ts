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
import { FloorsService } from '../../services/floors.service';
import { Floor } from 'app/classes/floor';

const makeFloorData = () => [
  { floorId: 1, name: 'Floor 1', startingDate: null, endingDate: null, storeId: 1 },
  { floorId: 2, name: 'Floor 2', startingDate: null, endingDate: null, storeId: 1 },
  { floorId: 3, name: 'Floor 1', startingDate: null, endingDate: null, storeId: 2 },
  { floorId: 4, name: 'Floor 1', startingDate: null, endingDate: null, storeId: 3 }
] as Floor[];

////////  Tests  /////////////
describe('FloorsService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [FloorsService]
  }));

  it('can instantiate service when inject service',
    inject([FloorsService], (service: FloorsService) => {
      expect(service instanceof FloorsService).toBe(true);
    }));

  describe('when getFloorsByStoreId', () => {
    let fakeFloors: any[];
    let storeId: number;
    let floorsService: FloorsService;

    beforeEach(() => {
      storeId = 1;
      fakeFloors = makeFloorData();
      floorsService = TestBed.get(FloorsService);
    });

    it('should have expected fake floors (Observable.do)', () => {
      floorsService.getFloorsByStore(storeId)
        .do(floors => {
          expect(floors.length).toBe(fakeFloors.filter(f => f.storeId === storeId).length,
            'should have expected no. of floors');
        });
    });

    it('should be OK returning no floors', () => {
      storeId = 0;
      floorsService.getFloorsByStore(storeId)
        .do(floors => {
          expect(floors.length).toBe(0,
            'should have no floors');
        });
    });

  });

  describe('when getFloorById', () => {
    let fakeFloors: any[];
    let floorId: number;
    let floorsService: FloorsService;

    beforeEach(() => {
      floorId = 1;
      fakeFloors = makeFloorData();
      floorsService = TestBed.get(FloorsService);
    });

    it('should have expected fake floor (Observable.do)', () => {
      floorsService.getFloorById(floorId)
        .do(floors => {
          expect(floors).toBe(fakeFloors.filter(f => f.floorId === floorId),
            'should have expected the correct floor');
        });
    });

    it('should be OK returning no floor', () => {
      floorId = 0;
      floorsService.getFloorById(floorId)
        .do(floor => {
          expect(floor).toBe(null,
            'should have no floor');
        });
    });
  });


  describe('when getFloorsByStoreId', () => {
    let fakeFloors: any[];
    let storeId: number;
    let floorsService: FloorsService;

    beforeEach(() => {
      storeId = 1;
      fakeFloors = makeFloorData();
      floorsService = TestBed.get(FloorsService);
    });

    it('should have expected fake floors (Observable.do)', () => {
      floorsService.getFloorsByStore(storeId)
        .do(floors => {
          expect(floors.length).toBe(fakeFloors.filter(f => f.storeId === storeId).length,
            'should have expected no. of floors');
        });
    });

    it('should be OK returning no floors', () => {
      storeId = 0;
      floorsService.getFloorsByStore(storeId)
        .do(floors => {
          expect(floors.length).toBe(0,
            'should have no floors');
        });
    });

  });


  describe('when deleteFloor', () => {
    let fakeFloors: any[];
    let floorId: number;
    let floorsService: FloorsService;

    beforeEach(() => {
      floorId = 1;
      fakeFloors = makeFloorData();
      floorsService = TestBed.get(FloorsService);
    });

    it('should have expected to delete a floor', () => {
      floorsService.deleteFloor(floorId)
        .do(response => {
          expect(fakeFloors.filter(f => f.floorId === floorId)).toBe(null,
            'should have expected not to find the floor we deleted');
        });
    });
  });


  describe('when editFloor', () => {
    let fakeFloors: any[];
    let floorId: number;
    let floorsService: FloorsService;

    beforeEach(() => {
      floorId = 1;
      fakeFloors = makeFloorData();
      floorsService = TestBed.get(FloorsService);
    });

    it('should have expected to edit a floor', () => {
      let floorName = 'New floor name';
      let floor: Floor = {
        floorId: floorId,
        name: floorName,
        storeId: 1
      }
      floorsService.editFloor(floor)
        .do(response => {
          expect(fakeFloors.filter(f => f.floorId === floorId)[0].name).toBe(floorName,
            'should have expected the floor to be edited');
        });
    });
  });


  describe('when addFloor', () => {
    let fakeFloors: any[];
    let floorId: number;
    let floorsService: FloorsService;

    beforeEach(() => {
      floorId = 1;
      fakeFloors = makeFloorData();
      floorsService = TestBed.get(FloorsService);
    });

    it('should have expected to add a floor', () => {
      floorId = 5;
      const floorName = 'New floor name';
      const floor = {
        floorId: floorId,
        name: floorName,
        startingDate: null,
        endingDate: null,
        storeId: 5
      }
      floorsService.addFloor(floor)
        .do(response => {
          expect(fakeFloors.filter(f => f.floorId === floorId)[0].name).toBe(floorName,
            'should have expected the floor to be created');
        });
    });
  });

});
