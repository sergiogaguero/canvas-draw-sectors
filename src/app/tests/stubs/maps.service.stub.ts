import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Blueprint } from '../../classes/blueprint';
import { BaseURL } from '../../classes/baseURL';

export class MapsServiceStub extends BaseURL {
    blueprints: Blueprint[] = [{
        mapId: 1,
        name: 'Blueprint #1',
        startingDate: new Date().toDateString(),
        floorId: 1,
        width: 10,
        height: 10
    }];
    blueprintsURL = this.getURL() + '/maps';

    getMaps(): Observable<Blueprint[]> {
        return Observable.of(this.blueprints);
    }

    getMapsByFloor(floorId: number): Observable<Blueprint[]> {
        return Observable.of(this.blueprints.filter(b => b.floorId === floorId));
    }

    addMap(blueprint: Blueprint): Observable<Blueprint> {
        blueprint.mapId = this.blueprints.length + 1;
        this.blueprints.push(blueprint);
        return Observable.of(blueprint);
    }

    editMap(blueprint: Blueprint): Observable<Blueprint> {
        const blueprintToModify = this.blueprints.filter(b => b.mapId === blueprint.mapId)[0];
        for (const key in blueprint) {
            if (blueprint[key] !== blueprintToModify[key]) {
                blueprintToModify[key] = blueprint[key];
            }
        }
        this.blueprints = this.blueprints.filter(b => b.mapId !== blueprint.mapId);
        this.blueprints.push(blueprintToModify);
        return Observable.of(blueprint);
    }

    deleteMap(blueprintId: number): Observable<null> {
        this.blueprints = this.blueprints.filter(b => b.mapId !== blueprintId);
        return Observable.of(null);
    }

    getCurrentMapByFloor(floorId: number): Observable<Blueprint> {
        const filteredBluerpints = this.blueprints.filter(
            b => b.floorId === floorId && b.endingDate === null
        )[0];
        return Observable.of(filteredBluerpints);
    }

    getMapUrlByGuid(guid: string): string {
        return this.blueprintsURL + '/download/' + guid;
    }

    getActiveMapForDate(floorId: number, date: string): Observable<Blueprint[]> {
        return Observable.of(this.blueprints);
    }
}
