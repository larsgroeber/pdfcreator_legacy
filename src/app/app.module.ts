import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app-component/app.component';
import {PDFDisplayComponent} from './pdf-display/pdf-display.component';
import {TextEditorComponent} from "./text-editor/text-editor.component";
import {APIService} from "./services/api.service";
import {LatexService} from "./latex-editor-old/latex.service";
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {appRoutes} from "./app.routes";
import { TemplateSelectComponent } from './template-select/template-select.component';
import {CompilerService} from "./services/compiler.service";
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import {TemplateService} from "./services/template.service";
import {EditGuard} from "./guards/edit.service";
import {FileUploadModule} from "ng2-file-upload";
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { UseTemplateComponent } from './use-template/use-template.component';
import { ReplacementKeyListComponent } from './replacement-key-list/replacement-key-list.component';
import { LatexEditorComponent } from './latex-editor/latex-editor.component';
import { FileManagerComponent } from './file-manager/file-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    PDFDisplayComponent,
    TextEditorComponent,
    TemplateSelectComponent,
    AboutComponent,
    HelpComponent,
    EditTemplateComponent,
    UseTemplateComponent,
    ReplacementKeyListComponent,
    LatexEditorComponent,
    FileManagerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FileUploadModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [LatexService, APIService, CompilerService, TemplateService, EditGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}

