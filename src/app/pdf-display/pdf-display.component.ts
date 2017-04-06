import {Component, Input} from '@angular/core';
import {SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-pdf-display',
  templateUrl: './pdf-display.component.html',
  styleUrls: ['./pdf-display.component.css']
})
export class PDFDisplayComponent {
  @Input() safeUri: SafeUrl;
}
