import {Routes} from "@angular/router";
import {AboutComponent} from "./about/about.component";
import {HelpComponent} from "./help/help.component";
import {EditGuard} from "./guards/edit.service";
import {TemplateSelectComponent} from './template-select/template-select.component';
import {EditTemplateComponent} from './edit-template/edit-template.component';
import {UseTemplateComponent} from './use-template/use-template.component';

export const appRoutes: Routes = [
  {path: '', redirectTo: '/use', pathMatch: 'full'},
  {path: 'use', component: TemplateSelectComponent, children: [
    {path: ':name', component: UseTemplateComponent}
  ]},
  {path: 'edit', component: TemplateSelectComponent, canActivate: [EditGuard], children: [
    {path: ':name', component: EditTemplateComponent}
  ]},
  {path: 'about', component: AboutComponent},
  {path: 'help', component: HelpComponent},
];
