import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {RuleEditorComponent} from "./rule-editor/rule-editor.component";
import {StencilAreaComponent} from "./stencil-area/stencil-area.component";
import {RuleAreaComponent} from "./rule-area/rule-area.component";

@NgModule({
  declarations: [
    AppComponent,
    RuleEditorComponent,
    StencilAreaComponent,
    RuleAreaComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
