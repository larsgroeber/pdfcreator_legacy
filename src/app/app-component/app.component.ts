import {Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser/src/security/dom_sanitization_service';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor( private sanitizer: DomSanitizer ) {
    }
}
