import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app-component/app.component';
import {PDFDisplayComponent} from './pdf-display/pdf-display.component';
import {TextEditorComponent} from "./text-editor/text-editor.component";
import {LatexService} from "./services/latex.service";
import {FileManagerComponent} from './file-manager/file-manager.component';
import {LatexEditorComponent} from './latex-editor/latex-editor.component';
import {NotifyService} from "./services/notify.service";
import {FileSelectDirective} from "ng2-file-upload";
import {RouterModule} from "@angular/router";
import {appRoutes} from "./routes";
import { TemplateSelectComponent } from './template-select/template-select.component';


@NgModule({
  declarations: [
    AppComponent,
    PDFDisplayComponent,
    TextEditorComponent,
    FileManagerComponent,
    LatexEditorComponent,
    FileSelectDirective,
    TemplateSelectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [NotifyService, LatexService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

