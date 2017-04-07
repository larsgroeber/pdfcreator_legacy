/**
 * @file file-editor.component.ts
 *
 * Displays a file manager and is responsible for saving files.
 *
 * @author Lars Gröber
 */

import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {LatexService} from "../latex.service";

interface File {
  name: string,
  text: string,
}

@Component({
  selector: 'app-file-editor',
  templateUrl: './file-editor.component.html',
  styleUrls: ['./file-editor.component.css']
})

export class FileEditorComponent implements OnInit {
  // array holding all files
  private files: File[] = [
    {name: 'latex.tex', text: 'some latex'},
    {name: 'image.png', text: 'hfauehfagbsdfk'},
  ];
  private selectedFile: File;

  constructor(private latex: LatexService) {
    this.latex.textChange$.subscribe(text => {
      this.selectedFile.text = text;
    })
    this.latex.updatePDF$.subscribe(docName => {
      this.fileSave(docName);
    });
    this.selectedFile = this.files[0];
  }

  /**
   * Changes the currently selected File and updates the model.
   * @param file
   */
  onFileClick(file: File): void {
    this.selectedFile = file;
    this.latex.onTextChange(file.text);
  }

  /**
   * Is called whenever all files should be saved.
   * @param docName
   */
  fileSave(docName: string): void {
    console.log("Saved file " + this.selectedFile.name);
  }

  onFileUpload(): void {

  }

  onFileNew(): void {

  }

  ngOnInit() {
  }

}
