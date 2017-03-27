import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {image_data} from "../dataurls";
import {Template} from "../../include/Template";
import * as _ from 'lodash';


declare var jsPDF: any;
declare var CKEDITOR: any;

interface Replacement {
    name: string,
    value: string
}

@Component({
    selector: 'app-pdfinput',
    templateUrl: './pdfinput.component.html',
    styleUrls: ['./pdfinput.component.css']
})
export class PDFInputComponent implements OnInit {

    constructor( private sanitizer: DomSanitizer ) {
    }

    uri: string;
    safeUri: SafeUrl;
    doc: any;
    ckEditor: any;
    keys: Replacement[];
    debug: string;

    onUpdateInput(): void {
        let t = new Template( this.ckEditor.getData() );
        t.setHtmlEscape();
        let values: Object = {};
        _.each(this.keys, (e: Replacement) => values[e.name] = e.value);
        let text = t.replace(values);
        this.genPDF(text);
    }

    onUpdatePDF(): void {
        let text = this.ckEditor.getData();
        let t = new Template( text );
        t.setHtmlEscape();
        this.keys = [];
        _.each(t.getKeys(), (e: string) => {
            this.keys.push({
                name: e,
                value: ''
            })
        });
        this.genPDF(text);
    }



    genPDF(text: string): void {
        this.doc = new jsPDF;
        this.doc.fromHTML(text, 15, 15
            , {
                'width': 180
            },
            () => {
                this.uri = this.doc.output('datauristring');
                this.updateSafeUri( this.uri);
        });
        /*
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
        this.doc.save( "zertifikat.pdf" );
    }

    updateSafeUri(uri: string): void {
        this.safeUri = this.sanitizer.bypassSecurityTrustResourceUrl( uri );
    }

    ngOnInit() {
        //this.genPDF();
        CKEDITOR.replace('editor1', {
            // An array of stylesheets to style the WYSIWYG area.
            // Note: it is recommended to keep your own styles in a separate file in order to make future updates painless.
            contentsCss: [ 'https://cdn.ckeditor.com/4.6.1/full-all/contents.css', '../include/ckeditor.css' ],
            // This is optional, but will let us define multiple different styles for multiple editors using the same CSS file.
            bodyClass: 'document-editor',
            height: 800,
        },
        );
        this.ckEditor = CKEDITOR.instances['editor1'];
        this.ckEditor.on('instanceReady', () => {
            this.onUpdatePDF();
        })
    }
}
