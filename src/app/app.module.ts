import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {RuleAreaComponent} from "./rule-area/rule-area.component";
import {HelpComponent} from "./help/help.component";
import {InspectorComponent} from "./inspector/inspector.component";
import {SettingsComponent} from "./settings/settings.component";
import {WebStorageModule} from "ngx-store";
import {SettingsService} from "./settings/settings.service";

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    RuleAreaComponent,
    HelpComponent,
    InspectorComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    WebStorageModule
  ],
  providers: [SettingsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
