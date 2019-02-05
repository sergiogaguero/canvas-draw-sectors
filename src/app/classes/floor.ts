// classes
import { Store } from './store';
import { Blueprint } from 'app/classes/blueprint';

export class Floor {
    floorId?: number;
    name: string;
    startingDate?: Date;
    endingDate?: Date;
    storeId: number;
    store?: Store;
    maps?: Blueprint[];
}
