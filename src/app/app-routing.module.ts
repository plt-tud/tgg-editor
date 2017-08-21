import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HelpComponent} from "./help/help.component";
import {RuleAreaComponent} from "./rule-area/rule-area.component";
import {SettingsComponent} from "./settings/settings.component";

const routes: Routes = [
  {path: '', component: RuleAreaComponent},
  {path: 'editor', component: RuleAreaComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'help', component: HelpComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
