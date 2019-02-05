import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Floor } from '../../classes/floor';

export class FloorsServiceStub {
    floors: Floor[] = [{
        name: 'Floor 1',
        storeId: 1,
        maps: []

      }];

    getFloors(): Observable<Floor[]> {
        return Observable.of(this.floors);
    }

    getFloorsByStore(storeId: number): Observable<Floor[]> {
        return Observable.of(this.floors.filter(f => f.storeId === storeId));
    }

    getFloorById(floorId: number): Observable<Floor> {
        return Observable.of(this.floors.filter(f => f.floorId === floorId)[0]);
    }

    addFloor(floor: Floor): Observable<Floor> {
        floor.floorId = this.floors.length + 1;
        this.floors.push(floor);
        return Observable.of(floor);
    }

    deleteFloor(floorId: number): Observable<null> {
        this.floors = this.floors.filter(f => f.floorId !== floorId);
        return Observable.of(null);
    }
}
