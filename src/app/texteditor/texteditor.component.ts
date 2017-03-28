import {Component, EventEmitter, OnInit, Output} from "@angular/core";

declare var CKEDITOR: any;

@Component({
    selector: 'app-text-editor',
    templateUrl: 'texteditor.component.html',
    // styleUrls: ['']
})
export class TextEditorComponent implements OnInit {
    private ckEditor: any;
    public text: string;

    @Output()
    private textChanged = new EventEmitter<string>();

    onTextChange(): void {
        this.textChanged.emit(this.text);
    }

    ngOnInit(): void {
      this.text = `
\\documentclass{article}

\\begin{document}
Hi <& Name &>,\\\\
First document. This is a simple example, with no
extra parameters or packages included.
\\end{document}`;
        /*CKEDITOR.replace('editor1', {
                // An array of stylesheets to style the WYSIWYG area.
                // Note: it is recommended to keep your own styles in a separate file in order to make future updates painless.
                contentsCss: ['https://cdn.ckeditor.com/4.6.1/full-all/contents.css', '../include/ckeditor.css'],
                // This is optional, but will let us define multiple different styles for multiple editors using the same CSS file.
                bodyClass: 'document-editor',
                height: 800,
            },
        );
        this.ckEditor = CKEDITOR.instances['editor1'];*/
    }
}
