import { environment } from '../../environments/environment';


export class BaseURL {

    private host: string;
    private portLoopback: string;
    private url: string;
    private protocol: string;

    constructor() {
        this.host = environment.host;
        if (environment.port === '443') {
            this.protocol = 'https'
            this.url = `${this.protocol}://${this.host}/${environment.segment}/api`;
        } else {
            this.portLoopback = environment.port;
            this.protocol = 'http';
            this.url = `${this.protocol}://${this.host}:${this.portLoopback}/api`;
        }
    }

    getURL() {
        return this.url;
    }

    getAccessToken() {
        let store = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        if (store) { return store.id; }
        return "";
    }

}

