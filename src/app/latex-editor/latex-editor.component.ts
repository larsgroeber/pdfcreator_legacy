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
import {CompilerService} from "../compiler.service";
import {SafeUrl, Title} from "@angular/platform-browser";

import * as Config from '../../../config';

declare let $: any;

@Component({
  selector: 'app-latex-editor',
  templateUrl: './latex-editor.component.html',
  styleUrls: ['./latex-editor.component.css']
})

export class LatexEditorComponent implements OnInit {
  currentDocName: string;
  public showNewDocDialog = false;
  public showCompiledPDF = false;
  public replacementKeys: string[];
  public safeURL: SafeUrl;

  constructor(private api: APIService
    , private notify: LatexService
    , private compiler: CompilerService
    , private titleService: Title) {}

  onCompilePDF(): void {
    this.onSavePDF();
    this.api.getOneDoc(this.currentDocName).subscribe(data => {
      let mainTex = data.find(f => f.name === 'main.tex');
      if (!mainTex) {
        Helper.displayMessage('Could not find main.tex', 0);
        return;
      }
      this.showCompiledPDF = true;
      this.replacementKeys = this.compiler.getKeys(mainTex.text);
      this.compiler.compileLatex(this.currentDocName, mainTex.text, url => this.safeURL = url);
    });
  }

  onSavePDF(): void {
    this.notify.onSaveFiles(this.currentDocName);
  }

  onLoadDoc(): void {
    this.notify.onloadDoc(this.currentDocName);
    this.showCompiledPDF = false;
  }

  onTemplateChange(template): void {
    console.log(template);
    this.currentDocName = template;
    this.titleService.setTitle(`${Config.APP_NAME} - edit: ${this.currentDocName}`);
    this.onLoadDoc();
  }

  /**
   * Deletes a document.
   */
  onDeleteDoc(): void {
    this.api.deleteDoc(this.currentDocName).subscribe(() => {
      this.notify.onloadTemplates();
    }, err => Helper.displayMessage(err, 0));
    this.currentDocName = '';
  }

  /**
   * Creates a new document.
   */
  onCreateDoc(): void {
    this.showNewDocDialog = false;
    this.api.createNewDoc(this.currentDocName).subscribe(() => {
      this.onLoadDoc();
      this.notify.onloadTemplates();
    }, err => Helper.displayMessage(err));
  }


  ngOnInit() {
    $(document).ready(function(){
      $('.modal').modal();

      $(window).scroll(() => {
        if ($('body').scrollTop() > 100) {
          $('.scroll-to-top').fadeIn();
        } else {
          $('.scroll-to-top').fadeOut();
        }
      })
      $(`.scroll-to-top`).click(() => {
        $('html body').animate({scrollTop: 0}, 800);
        return false;
      })
    });

    this.titleService.setTitle(`${Config.APP_NAME} - edit`);
  }
}
