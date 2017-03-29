import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {PDFInputComponent} from './pdfinput/pdfinput.component';
import {TextEditorComponent} from "./text-editor/text-editor.component";
import {LatexService} from "./latex.service";
import {FileManagerComponent} from './file-manager/file-manager.component';
import {LatexEditorComponent} from './latex-editor/latex-editor.component';
import {NotifyService} from "./notify.service";
import {FileSelectDirective} from "ng2-file-upload";

@NgModule({
  declarations: [
    AppComponent,
    PDFInputComponent,
    TextEditorComponent,
    FileManagerComponent,
    LatexEditorComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [NotifyService, LatexService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
