import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class TokensServiceStub {
    tokens = [{
        token: 'Token 1',
        label: 'POS Connection',
        apiTypeId: 1,
        apiType: {
            description: 'POS API'
        },
        id: 1
    },
    {
        token: 'Token 2',
        label: 'Employee Connection',
        apiTypeId: 1,
        apiType: {
            description: 'Employees API'
        },
        id: 2
    }];

    getTokens(): Observable<any[]> {
        return Observable.of(this.tokens);
    }

    addToken(token: any): Observable<any> {
        token.id = this.tokens.length + 1;
        token.token = 'Token ' + token.id;
        token.apiType = {
            description: 'Employees API'
        };
        this.tokens.push(token);
        return Observable.of(token);
    }

    deleteToken(tokenId: number): Observable<any> {
        this.tokens = this.tokens.filter(t => t.id !== tokenId);
        return Observable.of(null);
    }
}
