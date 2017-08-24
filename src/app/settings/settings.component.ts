import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {SettingsService} from "./settings.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  constructor(private settings: SettingsService,
              private location: Location) {
  }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }
}
