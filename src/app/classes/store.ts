import { Region } from './region';
import { Floor } from './floor';

export class Store {
    storeId?: number;
    name: string;
    regionId: number;
    responsableId: number;
    locationLong: string;
    locationLat: string;
    companyId: number;
    idinCustomerDB: string;
    floors?: Floor[] = [];
    company?: any;
    region?: Region;
    responsable?: any;
    timeZoneOffset: number;
    address: string;
  }
