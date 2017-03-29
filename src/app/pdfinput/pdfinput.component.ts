import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Template} from '../../include/Template';
import * as _ from 'lodash';
import {LatexService} from "../latex.service";
import {NotifyService} from "../notify.service";


declare var jsPDF: any;
declare var CKEDITOR: any;

interface Replacement {
  name: string;
  value: string;
}

@Component({
  selector: 'app-pdfinput',
  templateUrl: './pdfinput.component.html',
  styleUrls: ['./pdfinput.component.css']
})
export class PDFInputComponent implements OnInit {

  private _doc: any;
  public safeUri: SafeUrl;
  public keys: Replacement[];
  public error: string;

  /**
   * Untouched text from app-text-input.
   */
  private _text: string;

  constructor(private sanitizer: DomSanitizer, private latex: LatexService, private notify: NotifyService) {
    this.notify.saveFilesOb.subscribe(docName => {

    })
  }

  /**
   * Replaces placeholders with corresponding value and generates PDF.
   */
  onUpdateInput(): void {
    let t = new Template(this._text);
    let values: Object = {};
    _.each(this.keys, (e: Replacement) => values[e.name] = e.value);
    let text = t.replace(values);
    this.genPDF(text);
  }

  /**
   * Gets called when text changes. Generates inputs and updates PDF view.
   * @param text
   */
  onUpdatePDF(text: string): void {
    this._text = text;
    let t = new Template(text);
    this.keys = [];
    _.each(t.getKeys(), (e: string) => {
      this.keys.push({
        name: e,
        value: ''
      });
    });
    this.genPDF(text);
  }

  /**
   * Generates the PDF and displays it.
   * @param text
   */
  genPDF(text: string): void {
    this.latex.convertLatex(text).subscribe((data) => {
      this.updateSafeUri(data);
      this.error = '';
    }, (err) => {
        this.error = err;
    });
  }

  downloadPDF(): void {
    this._doc.save('zertifikat.pdf');
  }

  /**
   * Angular does not allow displaying unsafe urls.
   * @param uri
   */
  updateSafeUri(uri: string): void {
    this.safeUri = this.sanitizer.bypassSecurityTrustResourceUrl(uri);
  }

  ngOnInit() {
  }
}
