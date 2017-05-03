/**
 * @file latex-editor.component.ts
 *
 * Wrapper for file-editor and text-editor components.
 *
 * @author Lars Gröber
 */

import {Component, OnInit} from '@angular/core';
import {APIService} from "../services/api.service";
import {LatexService} from "./latex.service";
import {Helper} from "../../include/helper";
import {CompilerService} from "../services/compiler.service";
import {SafeUrl, Title} from "@angular/platform-browser";

import * as Config from '../../../config';
import {TemplateI} from "../../../server/interfaces/template";
import {TemplateService} from "../services/template.service";
import {Observable} from "rxjs/Observable";
import {mFile} from "../interfaces/mfile";

declare let $: any;

@Component({
  selector: 'app-latex-editor',
  templateUrl: './latex-editor.component.html',
  styleUrls: ['./latex-editor.component.css']
})

export class LatexEditorComponent implements OnInit {
  public currentTemplate: TemplateI;
  public showNewDocDialog = false;
  public showCompiledPDF = false;
  public showMoreOptions = false;
  public replacementKeys: string[];
  public safeURL: SafeUrl;
  public newDocName: string;

  constructor(private apiService: APIService
            , private latexService: LatexService
            , private compilerService: CompilerService
            , private titleService: Title
            , private templateService: TemplateService) {}

  onCompilePDF(): void {
    this.onSavePDF().subscribe(res => {
      this.apiService.getOneDoc(this.currentTemplate.name).subscribe(data => {
        let mainTex = data.find(f => f.name === 'main.tex');
        if (!mainTex) {
          Helper.displayMessage('Could not find main.tex', 0);
          return;
        }
        this.showCompiledPDF = true;
        this.replacementKeys = this.compilerService.getKeys(mainTex.text);
        this.compilerService.compileLatex(this.currentTemplate.name, mainTex.text).subscribe(
          url => this.safeURL = url,
          err => Helper.displayMessage(err, 0)
        );
      });
    }, err => Helper.displayMessage(err, 0));
  }

  onSavePDF(): Observable<{ template: TemplateI, files: mFile[] }> {
    return this.templateService.saveTemplate();
  }

  onLoadDoc(): void {
    this.latexService.onLoadDoc(this.currentTemplate);
    this.changeTitle();
    this.showCompiledPDF = false;
  }

  onTemplateChange(template: TemplateI): void {
    console.log(this.templateService.template)
    this.onSavePDF().subscribe(res => {
      this.currentTemplate = template;
      this.templateService.template = this.currentTemplate;
      this.changeTitle();
      this.onLoadDoc();
    })
  }

  onLoadDocComplete(): void {
    $('#description').trigger('autoresize');
    $(document).ready(function(){
      $('.tooltipped').tooltip({delay: 50});
    });
  }

  onTemplateInfoChange(): void {
    this.latexService.onTemplateChanged();
  }

  changeTitle(): void {
    if (this.currentTemplate) {
      this.titleService.setTitle(`${Config.APP_NAME} - edit: ${this.currentTemplate}`);
    } else {
      this.titleService.setTitle(`${Config.APP_NAME} - edit`);
    }
  }

  /**
   * Deletes a document.
   */
  onDeleteDoc(): void {
    this.apiService.deleteDoc(this.currentTemplate).subscribe(() => {
      this.latexService.onLoadTemplates('');
      this.currentTemplate = undefined;
      this.changeTitle();
    }, err => Helper.displayMessage(err, 0));
  }

  /**
   * Creates a new document.
   */
  onCreateDoc(): void {
    this.showNewDocDialog = false;
    this.apiService.createNewDoc(this.newDocName).subscribe(res => {
      this.currentTemplate = res.template;
      this.templateService.template = this.currentTemplate;
      this.newDocName = '';
      this.onLoadDoc();
      this.latexService.onLoadTemplates(this.currentTemplate.name);
    }, err => Helper.displayMessage(err, 0));
  }

  ngOnInit() {
    // scroll to top button
    $(document).ready(function(){
      $('.modal').modal();

      $(window).scroll(() => {
        // make it work in chrome and firefox
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 100) {
          $('.scroll-to-top').fadeIn();
        } else {
          $('.scroll-to-top').fadeOut();
        }
      })
      $(`.scroll-to-top`).click(() => {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
      })
    });

    this.titleService.setTitle(`${Config.APP_NAME} - edit`);
  }
}
