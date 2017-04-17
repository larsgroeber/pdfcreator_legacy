/**
 * @file notify.service.ts
 *
 * Notify service that enables different components to speak with each other.
 *
 * @author Lars Gröber
 */

import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {TemplateI} from "../../../server/interfaces/template";

@Injectable()
export class LatexService {

  constructor() { }

  // event when all files should be saved
  private saveFiles = new Subject<TemplateI>();
  saveFilesOb = this.saveFiles.asObservable();

  onSaveFiles(docName: TemplateI): void {
    this.saveFiles.next(docName);
  }

  // event when the text of the current file has changed
  private textChange = new Subject<string>();
  textChangeOb = this.textChange.asObservable();

  onTextChange(text: string): void {
    this.textChange.next(text);
  }

  // event when the text of the current file has changed
  private descriptionChanged = new Subject();
  descriptionChangedOb = this.descriptionChanged.asObservable();

  ondescriptionChanged(): void {
    this.descriptionChanged.next();
  }

  // event when a new doc should be loaded
  private loadDoc = new Subject<TemplateI>();
  loadDocOb = this.loadDoc.asObservable();

  onloadDoc(docName: TemplateI): void {
    this.loadDoc.next(docName);
  }

  // event when the template select should be reloaded
  private loadTemplates = new Subject<string>();
  loadTemplatesOb = this.loadTemplates.asObservable();

  onloadTemplates(selectedDoc: string): void {
    this.loadTemplates.next(selectedDoc);
  }

  // event when the current document should be compiled and rendered
  private compilePDF = new Subject<string>();
  compilePDFOb = this.compilePDF.asObservable();

  onCompilePDF(docName: string): void {
    this.compilePDF.next(docName);
  }
}
