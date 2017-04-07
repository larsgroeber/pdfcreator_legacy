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
import {mFile} from "../mfile";
import {Replacement} from "../replacement";
import {Helper} from "../../include/helper";
import {CompilerService} from "../compiler.service";

import * as Config from '../../../config';


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
  private _docName: string;

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
    this.api.getOneDoc(this._docName).subscribe(data => {
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

  onTemplateChange(template): void {
    this._docName = template;
    this.titleService.setTitle(`${Config.APP_NAME} - ${this._docName}`);
    this.onUpdatePDF();
  }

  /**
   * Generates the PDF and displays it.
   */
  genPDF(values?: Object): void {
    if (!values) values = {};
    this.compiler.replaceAndCompile(this._docName, this._mainTex.text, values
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