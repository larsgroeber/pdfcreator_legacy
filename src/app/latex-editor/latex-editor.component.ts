/**
 * @file latex-editor.component.ts
 *
 * Wrapper for file-editor and text-editor components.
 *
 * @author Lars Gröber
 */

import {Component, OnInit} from '@angular/core';
import {APIService} from "../api.service";
import {LatexService} from "./latex.service";
import {Helper} from "../../include/helper";

declare let $: any;

@Component({
  selector: 'app-latex-editor',
  templateUrl: './latex-editor.component.html',
  styleUrls: ['./latex-editor.component.css']
})

export class LatexEditorComponent implements OnInit {
  currentDocName: string;
  public documents: string[];
  public showNewDocDialog: boolean = false;

  constructor(private latex: APIService, private notify: LatexService) {}

  onCompilePDF(): void {
    this.onSavePDF();
    this.notify.onCompilePDF(this.currentDocName);
  }

  onSavePDF(): void {
    this.notify.onSaveFiles(this.currentDocName);
  }

  onLoadDoc(): void {
    this.notify.onloadDoc(this.currentDocName);
  }

  onTemplateChange(template): void {
    console.log(template);
    this.currentDocName = template;
    this.onLoadDoc();
  }

  /**
   * Deletes a document.
   */
  onDeleteDoc(): void {
    this.latex.deleteDoc(this.currentDocName).subscribe(() => {
      this.notify.onloadTemplates();
    }, err => Helper.displayMessage(err));
    this.currentDocName = '';
  }

  /**
   * Creates a new document.
   */
  onCreateDoc(): void {
    this.showNewDocDialog = false;
    this.latex.createNewDoc(this.currentDocName).subscribe(() => {
      this.onLoadDoc();
      this.notify.onloadTemplates();
    }, err => Helper.displayMessage(err));
  }


  ngOnInit() {
    $(document).ready(function(){
      $('.modal').modal();
    });
  }
}
