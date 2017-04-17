/**
 * @file pdfinput.component.ts
 *
 * Displays the PDF and the replacement inputs.
 *
 * @author Lars Gröber
 */

import {Component, OnInit} from '@angular/core';
import {SafeUrl, Title} from '@angular/platform-browser';
import * as _ from 'lodash';
import {APIService} from "../api.service";
import {mFile} from "../interfaces/mfile";
import {Replacement} from "../interfaces/replacement";
import {Helper} from "../../include/helper";
import {CompilerService} from "../compiler.service";

import * as Config from '../../../config';
import {TemplateI} from "../../../server/interfaces/template";


@Component({
  selector: 'app-fill-template',
  templateUrl: './fill-template.component.html',
  styleUrls: ['./fill-template.component.css']
})
export class FillTemplateComponent implements OnInit {

  public safeUri: SafeUrl;
  public keys: Replacement[];
  public error: string;

  /**
   * Untouched main.tex file.
   */
  private _mainTex: mFile;
  private templateName: string;
  private template: TemplateI;

  constructor(private api: APIService
    , private compiler: CompilerService
    , private titleService: Title) {
  }

  /**
   * Replaces placeholders with corresponding value and generates PDF.
   */
  onUpdateInput(): void {
    let values: Object = {};
    _.each(this.keys, (e: Replacement) => values[e.name] = e.value);
    this.genPDF(values);
  }

  /**
   * Gets called when PDF gets rendered for the first time.
   * Generates inputs and updates PDF view.
   */
  onUpdatePDF(): void {
    this.api.getOneDoc(this.templateName).subscribe(data => {
      this._mainTex = data.find(f => f.name === 'main.tex');
      if (!this._mainTex) {
        Helper.displayMessage('Could not find main.tex!', 0);
        return;
      }
      this.keys = [];
      _.each(this.compiler.getKeys(this._mainTex.text), (e: string) => {
        this.keys.push({
          name: e
        });
      });
      this.genPDF();
    });
  }

  onTemplateChange(template: TemplateI): void {
    this.template = template;
    this.templateName = template.name;
    this.titleService.setTitle(`${Config.APP_NAME} - ${this.templateName}`);
    this.onUpdatePDF();
  }

  /**
   * Generates the PDF and displays it.
   */
  genPDF(values?: Object): void {
    if (!values) values = {};
    this.compiler.replaceAndCompile(this.templateName, this._mainTex.text, values
      , url => this.safeUri = url);
  }

  /**
   * TODO
   */
  downloadPDF(): void {
    //document.location.href = this.safeUri.toString();
    //Helper.displayMessage('Not implemented!');
  }

  ngOnInit() {
    this.titleService.setTitle(`${Config.APP_NAME}`);
  }
}
