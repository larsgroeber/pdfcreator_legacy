/**
 * @file pdfinput.component.ts
 *
 * Displays the PDF and the replacement inputs.
 *
 * @author Lars Gröber
 */

import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Template} from '../../include/Template';
import * as _ from 'lodash';
import {LatexService} from "../services/latex.service";
import {NotifyService} from "../services/notify.service";
import {mFile} from "../mfile";

interface Replacement {
  name: string;
  value: string;
}

@Component({
  selector: 'app-pdfinput',
  templateUrl: './pdf-display.component.html',
  styleUrls: ['./pdf-display.component.css']
})
export class PDFDisplayComponent implements OnInit {

  public safeUri: SafeUrl;
  public keys: Replacement[];
  public error: string;

  /**
   * Untouched main.tex file.
   */
  private _mainTex: mFile;
  private _docName: string;

  constructor(private sanitizer: DomSanitizer, private latex: LatexService, private notify: NotifyService) {
  }

  /**
   * Replaces placeholders with corresponding value and generates PDF.
   */
  onUpdateInput(): void {
    let t = new Template(this._mainTex.text);
    let values: Object = {};
    _.each(this.keys, (e: Replacement) => values[e.name] = e.value);
    this._mainTex.text = t.replace(values);
    this.genPDF();
  }

  /**
   * Gets called when PDF gets rendered for the first time.
   * Generates inputs and updates PDF view.
   */
  onUpdatePDF(): void {
    let text = this._mainTex.text;
    let t = new Template(text);
    this.keys = [];
    _.each(t.getKeys(), (e: string) => {
      this.keys.push({
        name: e,
        value: ''
      });
    });
    this.genPDF();
  }

  /**
   * Generates the PDF and displays it.
   */
  genPDF(): void {
    this.latex.convertLatex(this._docName, this._mainTex.text).subscribe((data) => {
      this.updateSafeUri(data);
      this.error = '';
    }, (err) => {
        this.error = `${err}`;
    });
  }

  /**
   * TODO
   */
  downloadPDF(): void {
  }

  /**
   * Angular does not allow displaying unsafe urls.
   * @param uri
   */
  updateSafeUri(uri: string): void {
    this.safeUri = this.sanitizer.bypassSecurityTrustResourceUrl(uri);
  }

  ngOnInit() {
    // listen to compilePDF event
    this.notify.compilePDFOb.subscribe(docName => {
      this._docName = docName;
      this.latex.getOneDoc(docName).subscribe(files => {
        this._mainTex = files.find(f => f.name === 'main.tex');
        if (this._mainTex) {
          this.onUpdatePDF();
        } else {
          this.error = 'Could not find "main.tex"!';
          console.error(this.error);
        }
      })
    })
  }
}
