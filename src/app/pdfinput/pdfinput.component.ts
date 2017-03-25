import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {image_data} from "../dataurls";

declare var jsPDF: any;
declare var CKEDITOR: any;

@Component({
    selector: 'app-pdfinput',
    templateUrl: './pdfinput.component.html',
    styleUrls: ['./pdfinput.component.css']
})
export class PDFInputComponent implements OnInit {

    constructor( private sanitizer: DomSanitizer ) {
    }

    name: string = "";
    workshop: string = "";
    betreuer: string = "";
    uri: string;
    doc: any;
    ckEditor: any;

    onInputChange(): void {
        this.genPDF();
    }

    onUpdatePDF(): void {
        this.doc = new jsPDF;
        this.doc.fromHTML('<div style="padding: 1cm 2cm 2cm;">' + this.ckEditor.getData(), 15, 15
            , {
            'width': 180
            });
        this.uri = this.doc.output('datauristring');
    }

    genPDF(): void {
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
    }

    downloadPDF(): void {
        this.doc.save( "zertifikat.pdf" );
    }

    getUri(): SafeUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl( this.uri );
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
        });
        this.ckEditor = CKEDITOR.instances['editor1'];
        this.onUpdatePDF();
    }
}
