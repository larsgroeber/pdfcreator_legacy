import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class NotifyService {

  constructor() { }

  private saveFiles = new Subject<string>();
  saveFilesOb = this.saveFiles.asObservable();

  onSaveFiles(docName: string): void {
    this.saveFiles.next(docName);
  }

  private textChange = new Subject<string>();
  textChangeOb = this.textChange.asObservable();

  onTextChange(text: string): void {
    this.textChange.next(text);
  }

  private compilePDF = new Subject<string>();
  compilePDFOb = this.compilePDF.asObservable();

  onCompilePDF(): void {
    this.compilePDF.next();
  }

}
