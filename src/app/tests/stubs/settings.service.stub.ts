import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Constants } from '../../classes/constants';

const GENERAL_SETTINGS = Constants.getGeneralSettings();

export class SettingsServiceStub {
    settingsURL = '';
    settings = {
        settingId: 0,
        visits: 300,
        passByBegin: 100,
        passByEnd: 300,
        ratio: 0,
        knownPeriod: GENERAL_SETTINGS.KNOWN_VISITOR_PERIODS[0].dbValue,
        discarded: GENERAL_SETTINGS.DEVICE_DISCARD_SIGHTINGS[0]
    };

    getSettings() {
        return Observable.of(this.settings);
    }

    editSettings(newSettings) {
        this.settings = newSettings;
        return Observable.of(this.settings);
    }

    updateViews() {
        return Observable.of(null);
    }
}
