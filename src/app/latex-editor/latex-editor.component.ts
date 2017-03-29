/**
 * @file latex-editor.component.ts
 *
 * Wrapper for file-editor and text-editor components.
 *
 * @author Lars Gröber
 */

import {Component, OnInit} from '@angular/core';
import {LatexService} from "../latex.service";
import {NotifyService} from "../notify.service";

@Component({
  selector: 'app-latex-editor',
  templateUrl: './latex-editor.component.html',
  styleUrls: ['./latex-editor.component.css']
})

export class LatexEditorComponent implements OnInit {
  docName: string;
  currentDocName: string;

  constructor(private latex: LatexService, private notify: NotifyService) { }

  /**
   * Gets called whenever the PDF view should be updated.
   * Effectively tells the file-manager to save all files and recompile the PDF.
   */
  onSavePDF(): void {
    this.notify.onSaveFiles(this.docName);
  }

  onLoadDoc(): void {
    this.currentDocName = this.docName;
    this.onSavePDF();
  }

  onDeleteDoc(): void {
    this.latex.deleteDoc(this.docName).subscribe();
  }

  onCreateDoc(): void {
    this.latex.createNewDoc(this.docName).subscribe(() => {
      this.onLoadDoc();
    });
  }

  ngOnInit() {
  }

}
