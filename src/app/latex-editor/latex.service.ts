/**
 * @file notify.service.ts
 *
 * Notify service that enables different components to speak with each other.
 *
 * @author Lars Gröber
 */

import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class LatexService {

  constructor() { }

  // event where all files should be saved
  private saveFiles = new Subject<string>();
  saveFilesOb = this.saveFiles.asObservable();

  onSaveFiles(docName: string): void {
    this.saveFiles.next(docName);
  }

  // event where the text of the current file has changed
  private textChange = new Subject<string>();
  textChangeOb = this.textChange.asObservable();

  onTextChange(text: string): void {
    this.textChange.next(text);
  }

  // event where a new doc should be loaded
  private loadDoc = new Subject<string>();
  loadDocOb = this.loadDoc.asObservable();

  onloadDoc(docName: string): void {
    this.loadDoc.next(docName);
  }

  // event where a new doc should be loaded
  private loadTemplates = new Subject<string>();
  loadTemplatesOb = this.loadTemplates.asObservable();

  onloadTemplates(selectedDoc: string): void {
    this.loadTemplates.next(selectedDoc);
  }

  // event where the current document should be compiled and rendered
  private compilePDF = new Subject<string>();
  compilePDFOb = this.compilePDF.asObservable();

  onCompilePDF(docName: string): void {
    this.compilePDF.next(docName);
  }
}