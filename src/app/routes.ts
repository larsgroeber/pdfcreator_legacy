import {Routes} from "@angular/router";
import {LatexEditorComponent} from "./latex-editor/latex-editor.component";
import {PDFDisplayComponent} from "./pdf-display/pdf-display.component";
import {FillTemplateComponent} from "./fill-template/fill-template.component";
import {AboutComponent} from "./about/about.component";
import {HelpComponent} from "./help/help.component";
import {AuthService} from "./guards/auth.service";

export const appRoutes: Routes = [
  {path: '', redirectTo: '/use', pathMatch: 'full'},
  {path: 'use', component: FillTemplateComponent},
  {path: 'edit', component: LatexEditorComponent, canActivate: [AuthService]},
  {path: 'about', component: AboutComponent},
  {path: 'help', component: HelpComponent},
];
