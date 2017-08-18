import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RuleEditorComponent} from "./rule-editor/rule-editor.component";

const routes: Routes = [
  {path: '', component: RuleEditorComponent},
  {path: 'settings', component: RuleEditorComponent},
  {path: 'help', component: RuleEditorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
