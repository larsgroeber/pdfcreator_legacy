import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app-component/app.component';
import {PDFDisplayComponent} from './pdf-display/pdf-display.component';
import {TextEditorComponent} from "./latex-editor/text-editor/text-editor.component";
import {APIService} from "./api.service";
import {FileManagerComponent} from './latex-editor/file-manager/file-manager.component';
import {LatexEditorComponent} from './latex-editor/latex-editor.component';
import {LatexService} from "./latex-editor/latex.service";
import {RouterModule} from "@angular/router";
import {appRoutes} from "./routes";
import { TemplateSelectComponent } from './template-select/template-select.component';
import { FillTemplateComponent } from './fill-template/fill-template.component';
import {CompilerService} from "./compiler.service";
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    PDFDisplayComponent,
    TextEditorComponent,
    LatexEditorComponent,
    TemplateSelectComponent,
    FillTemplateComponent,
    AboutComponent,
    FileManagerComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [LatexService, APIService, CompilerService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

