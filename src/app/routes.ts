import {Routes} from "@angular/router";
import {LatexEditorComponent} from "./latex-editor/latex-editor.component";
import {PDFDisplayComponent} from "./pdf-display/pdf-display.component";

export const appRoutes: Routes = [
  {path: '', component: PDFDisplayComponent},
  {path: 'edit', component: LatexEditorComponent}
];
