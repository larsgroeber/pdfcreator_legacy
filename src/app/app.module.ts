import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {PDFInputComponent} from './pdfinput/pdfinput.component';
import {UriService} from "./uri.service";
import {TextEditorComponent} from "./texteditor/texteditor.component";
import {LatexService} from "./latex.service";

@NgModule({
    declarations: [
        AppComponent,
        PDFInputComponent,
        TextEditorComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [ UriService, LatexService ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
