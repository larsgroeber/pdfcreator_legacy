/**
 * @file latex-editor.component.ts
 *
 * Wrapper for file-editor and text-editor components.
 *
 * @author Lars Gröber
 */

import {Component, OnInit} from '@angular/core';
import {LatexService} from "../services/latex.service";
import {NotifyService} from "../services/notify.service";

@Component({
  selector: 'app-latex-editor',
  templateUrl: './latex-editor.component.html',
  styleUrls: ['./latex-editor.component.css']
})

export class LatexEditorComponent implements OnInit {
  docName: string;
  currentDocName: string;
  public documents: string[];
  public showNewDocDialog: boolean = false;

  error: string;

  constructor(private latex: LatexService, private notify: NotifyService) {}

  /**
   * Gets called whenever the PDF view should be updated.
   * Effectively tells file-manager to save all files and pdf-input to recompile the PDF.
   */
  onCompilePDF(): void {
    this.onSavePDF();
    this.notify.onCompilePDF(this.currentDocName);
  }

  onSavePDF(): void {
    this.notify.onSaveFiles(this.docName);
  }

  onLoadDoc(): void {
    if (this.currentDocName) {
      this.onSavePDF();
    }
    this.currentDocName = this.docName;
    this.notify.onloadDoc(this.docName);
  }

  /**
   * Deletes a document.
   */
  onDeleteDoc(): void {
    this.latex.deleteDoc(this.docName).subscribe(() => {}, err => this.showError(err));
    this.docName = '';
    this.currentDocName = '';
    this.updateDocList();
  }

  /**
   * Creates a new document.
   */
  onCreateDoc(): void {
    this.showNewDocDialog = false;
    this.latex.createNewDoc(this.docName).subscribe(() => {
      this.onLoadDoc();
      this.updateDocList();
    }, err => this.showError(err));
  }

  updateDocList(): void {
    this.latex.getAllDocs().subscribe(docs => this.documents = docs, err => this.showError(err));
  }

  showError(err: string): void {
    this.error = err;
    setTimeout(() => this.error = '', 10000);
  }

  ngOnInit() {
    this.updateDocList();
  }
}
