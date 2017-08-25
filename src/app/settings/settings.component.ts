import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {SettingsService} from "./settings.service";
import {BackendService} from "../backend.service";
import "rxjs/add/operator/map";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  constructor(private settings: SettingsService,
              private location: Location,
              private backend: BackendService) {
  }

  test = "not yet queried";

  ngOnInit() {
    this.backend.getTest().subscribe(data => {
      console.log(data);
      this.test = data.test
    });
  }


  back() {
    this.location.back();
  }


}
