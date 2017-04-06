import {Routes} from "@angular/router";
import {LatexEditorComponent} from "./latex-editor/latex-editor.component";
import {PDFDisplayComponent} from "./pdf-display/pdf-display.component";
import {FillTemplateComponent} from "./fill-template/fill-template.component";

export const appRoutes: Routes = [
  {path: '', component: FillTemplateComponent},
  {path: 'edit', component: LatexEditorComponent}
];
