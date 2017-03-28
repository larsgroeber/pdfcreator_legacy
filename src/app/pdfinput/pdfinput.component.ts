import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Template} from '../../include/Template';
import * as _ from 'lodash';
import {LatexService} from "../latex.service";


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

  public _uri: string;
  private _doc: any;
  public safeUri: SafeUrl;
  public keys: Replacement[];
  public error: string;

  /**
   * Untouched text from app-text-input.
   */
  private _text: string;

  private debug: string;

  constructor(private sanitizer: DomSanitizer, private latex: LatexService) {
  }

  /**
   * Replaces placeholders with corresponding value and generates PDF.
   */
  onUpdateInput(): void {
    let t = new Template(this._text);
    //t.setHtmlEscape();
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
    //t.setHtmlEscape();
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
    /*
    this._doc = new jsPDF;
    this._doc.fromHTML(text, 15, 15
      , {
        'width': 180
      },
      () => {
        this._uri = this._doc.output('datauristring');
        this.updateSafeUri(this._uri);
      });

     let dFSize: number = 14;

     let name = this.name ? this.name : "<NAME>";
     let workshop = this.workshop ? this.workshop : "<WORKSHOP>";
     let betreuer = this.betreuer ? this.betreuer : "<BETREUER>";

     this.doc = new jsPDF;

     this.doc.addImage( image_data.starkerStart, 'PNG', 10, 10, 80, 30 );

     this.doc.setFillColor( 206, 125, 4 );
     this.doc.rect( 0, 45, 30, 10, 'F' );

     this.doc.setTextColor( 3, 79, 160 );
     this.doc.setFontSize( 40 );
     this.doc.text( 'Teilnahmezertifikat', 40, 55 );

     this.doc.setFontSize( dFSize );
     this.doc.setTextColor( 0, 0, 0 );
     this.doc.text(name, 40, 70 );
     this.doc.text("Hat erfolgreich am Workshop", 40, 80 );

     this.doc.setFontSize( 25 );
     this.doc.text(workshop, 40, 95 );

     this.doc.setFontSize( dFSize );
     this.doc.text("teilgenommen.", 40, 105 );

     this.doc.text(betreuer, 40, 200 );

     this.uri = this.doc.output( 'datauristring' );
     */
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
