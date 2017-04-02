import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app-component/app.component';
import {PDFDisplayComponent} from './pdf-display/pdf-display.component';
import {TextEditorComponent} from "./text-editor/text-editor.component";
import {LatexService} from "./services/latex.service";
import {LatexEditorComponent} from './latex-editor/latex-editor.component';
import {NotifyService} from "./services/notify.service";
import {FileUploadModule} from "ng2-file-upload";
import {FileManagerComponent} from "./file-manager/file-manager.component";

@NgModule({
  declarations: [
    AppComponent,
    PDFDisplayComponent,
    TextEditorComponent,
    LatexEditorComponent,
    FileManagerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FileUploadModule
  ],
  providers: [NotifyService, LatexService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
