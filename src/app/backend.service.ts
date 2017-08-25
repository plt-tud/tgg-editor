import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

@Injectable()
export class BackendService {

  constructor(private http: Http) {
  }


  getTest() {
    return this.http.get('/api/test/')
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res) {
    const body = res.json();
    return body || {};
  }

  private handleError(error) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(error);
  }

}
