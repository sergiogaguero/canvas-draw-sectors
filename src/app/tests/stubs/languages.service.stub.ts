import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Language } from '../../classes/language';

export class LanguagesServiceStub {
    languages = [
      {
        "langId": 0,
        "key": "string",
        "name": "string"
      }
    ];

    getLanguages() {
        return Observable.of(this.languages)
    }
}
