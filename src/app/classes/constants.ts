export class Constants {
    static readonly DATE_FMT = 'dd/MMM/yyyy';
    static readonly DATE_TIME_FMT = `${Constants.DATE_FMT} hh:mm:ss`;
    static readonly roles = {
        admin: 'Admin',
        storeMgr: 'GteTienda',
        regionMgr: 'GteRed',
        associate: 'Vendedor'
    };
    static readonly HTTP_STATUS = {
        OK: 200,
        NO_CONTENT: 204,
        NOT_FOUND: 404
    };
    static readonly UNITS = {
        'default': {
            label: '',
            divisor: 1000000000000,
        },
        '0': {
            label: '',
            divisor: 1,
        },
        '1': {
            label: 'K',
            divisor: 1000,
        },
        '2': {
            label: 'M',
            divisor: 1000000,
        },
        '3': {
            label: 'B',
            divisor: 1000000000,
        },
        '4': {
            label: 'T',
            divisor: 1000000000000,
        },
    };

    static readonly googleMapsKey = 'AIzaSyDAwEhMNt07Yyb3s5tqQviYH9Ot1RAZKVY';

    static readonly dialogWidth = '400px';

    static readonly GENERAL_SETTINGS = {
        KNOWN_VISITOR_PERIODS: [
            { dbValue: 1, translation: 'config.general.oneMonth' },
            { dbValue: 3, translation: 'config.general.threeMonths' },
            { dbValue: 6, translation: 'config.general.sixMonths' },
            { dbValue: 12, translation: 'config.general.twelveMonths' },
            { dbValue: 1200, translation: 'config.general.all' }
        ],
        DEVICE_DISCARD_SIGHTINGS: [
            60, 120, 180, 240, 300
        ],
        VISITORS_TIME_MAX: 10,
        RATIO_MAX_PERCENTAGE: 100,
    };

    static readonly INTERNAL_STATUS_CODE = [
        { code: '601', title: 'config.user.errorDelete', message: 'config.user.errorDeleteMessage' }, // users with store or regions associate
        { code: '602', title: 'config.user.errorDelete', message: 'config.regions.delete.deleteRegionWithFloors' }, // regions with store associate
        { code: '603', title: 'config.user.errorDelete', message: 'config.store.list.deleteStoreWithFloors' }, // store with floors associate
        { code: '604', title: 'config.user.errorDelete', message: 'config.store.edit.floor.alertDeleteFloorWithMap' }, // floors with maps associate
    ];

    static readonly DEVICE_SCREEN_SIZES = {
        smartphone: {
            width: 720,
            height: 1280
        },
        tablet: {
            width: 1280,
            height: 800
        }
    }

    static readonly STATUS_CODE = [0, 404, 500];

    static getRoles(): any {
        return this.roles;
    }

    static getGeneralSettings(): any {
        return this.GENERAL_SETTINGS;
    }

}
