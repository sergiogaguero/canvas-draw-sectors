// basic for testing
import {
    inject, TestBed, getTestBed
} from '@angular/core/testing';
// basic for testing services
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

import { Observable } from 'rxjs/Observable';

// services
import { TokensService } from '../../services/tokens.service';
import { Token } from 'app/classes/token';
import { BaseURL } from 'app/classes/baseURL';

const baseURL = new BaseURL();
const apiURL = baseURL.getURL() + '/tokens';

const makeTokensData = () => [
    {
        token: 'sasasarasasasarasasa',
        label: 'POS Connection',
        apiTypeId: 1,
        id: 1
    },
    {
        token: 'parappapapaparapapa',
        label: 'Employee Connection',
        apiTypeId: 1,
        id: 2
    }
] as Token[];

////////  Tests  /////////////
describe('TokensService', () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TokensService]
        });
        injector = getTestBed();
        httpMock = TestBed.get(HttpTestingController);
    });

    it('can instantiate service when inject service',
        inject([TokensService], (service: TokensService) => {
            expect(service instanceof TokensService).toBe(true);
        }));

    describe('when getTokens', () => {
        let fakeTokens: Token[];
        let tokensService: TokensService;
        let getTokensFilter: string;

        beforeEach(() => {
            fakeTokens = makeTokensData();
            tokensService = TestBed.get(TokensService);
            getTokensFilter = '?filter={"include":"apiType"}';
        });

        it('should have expected fake tokens (Observable.do)', () => {
            tokensService.getTokens()
                .do(tokens => {
                    expect(tokens.length).toBe(fakeTokens.length,
                        'should have expected no. of tokens');
                });
        });

        it('should call the correct URL', () => {
            tokensService.getTokens().subscribe();
            httpMock.expectOne(apiURL + getTokensFilter).flush(fakeTokens);
            httpMock.verify();
        });
    });

    describe('when addToken', () => {
        let fakeTokens: Token[];
        let tokensService: TokensService;
        let newToken: Token;

        beforeEach(() => {
            fakeTokens = makeTokensData();
            tokensService = TestBed.get(TokensService);
            newToken = {
                label: 'New token',
                token: 'salksjfaiejowieuroaiew',
                apiTypeId: 2
            };
        });

        it('should have created new token (Observable.do)', () => {
            tokensService.addToken(newToken)
                .do(tokens => {
                    expect(newToken).toBe(fakeTokens.find(t => t.token === newToken.token)[0],
                        'should have expected the new token to be inserted');
                });
        });

        it('should call the correct URL', () => {
            tokensService.addToken(newToken).subscribe();
            httpMock.expectOne(apiURL).flush(newToken);
            httpMock.verify();
        });
    });


    describe('when deleteToken', () => {
        let fakeTokens: Token[];
        let tokensService: TokensService;
        let tokenId: number;

        beforeEach(() => {
            fakeTokens = makeTokensData();
            tokensService = TestBed.get(TokensService);
            tokenId = 1;
        });

        it('should have deleted a token (Observable.do)', () => {
            tokensService.deleteToken(tokenId)
                .do(tokens => {
                    expect(fakeTokens.find(t => t.id === tokenId)[0]).toBe(null,
                        'should have expected the a token to be deleted');
                });
        });

        it('should call the correct URL', () => {
            tokensService.addToken(tokenId).subscribe();
            httpMock.expectOne(apiURL).flush(null);
            httpMock.verify();
        });
    });


});
