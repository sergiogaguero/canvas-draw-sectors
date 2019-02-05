import { Store } from './store';

export class Region {
    regionId?: number;
    name: string;
    responsableId: number;
    responsable?: {
        name: string;
        lastname: string;
        accountId: number;
    };
    stores?: Store[];
}
