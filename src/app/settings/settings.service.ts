import {Injectable} from "@angular/core";
import {LocalStorage} from "ngx-store";

@Injectable()
export class SettingsService {

  @LocalStorage() public endpoint: String;
  @LocalStorage() public namedGraph: String;

  constructor() {
    this.endpoint = this.endpoint || "http://localhost:9998/sparql";
    this.namedGraph = this.namedGraph || "http://eatld.et.tu-dresden.de/tgg";
  }
}
