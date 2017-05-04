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
import {APIService} from "../services/api.service";
import {mFile} from "../interfaces/mfile";
import {Replacement} from "../interfaces/replacement";
import {Helper} from "../../include/helper";
import {CompilerService} from "../services/compiler.service";

import * as Config from '../../../config';
import {TemplateI} from "../../../server/interfaces/template";
import {TableDecoder} from "../../include/table-decoder";

declare let $: any;


@Component({
  selector: 'app-fill-template',
  templateUrl: './fill-template.component.html',
  styleUrls: ['./fill-template.component.css']
})
export class FillTemplateComponent implements OnInit {

  public safeUri: SafeUrl;
  public replacements: Replacement[];
  public keys: string[];
  public error: string;
  public viewTabs = false;

  /**
   * Untouched main.tex file.
   */
  private _mainTex: mFile;
  private templateName: string;
  private template: TemplateI;

  public csvFile: File;
  public csvFileJson: JSON;
  public csvFileKeys: string[];

  constructor(private api: APIService
    , private compiler: CompilerService
    , private titleService: Title) {
  }

  /**
   * Replaces placeholders with corresponding value and generates PDF.
   */
  onUpdateInput(): void {
    let values: Object = {};
    _.each(this.replacements, (e: Replacement) => values[e.name] = e.value);
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
      this.replacements = [];
      this.keys = this.compiler.getKeys(this._mainTex.text);
      _.each(this.keys, (e: string) => {
        this.replacements.push({
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
    $(document).ready(function () {
      $('.tooltipped').tooltip({delay: 50});
    });
  }

  toggleViewTabs(): void {
    this.viewTabs = !this.viewTabs;
    if (this.viewTabs) {
      $(document).ready(function () {
        $('ul.tabs').tabs();
      });
    }
  }

  /**
   * Generates the PDF and displays it.
   */
  genPDF(values?: Object): void {
    if (!values) values = {};
    this.compiler.replaceAndCompile(this.templateName, this._mainTex.text, values).subscribe(
      url => this.safeUri = url,
      err => Helper.displayMessage(err, 0)
    );
  }

  /**
   * Calls TableDecoder methods on the content of an uploaded csv file.
   * @param event
   */
  onCSVFileChange(event) {
    this.csvFile = event.srcElement.files[0];

    let reader: FileReader = new FileReader();

    if (!this.csvFile.type.match(/text.*/)) {
      Helper.displayMessage('File type not supported!', 1);
      return;
    }

    reader.onload = (e) => {
      try {
        this.csvFileKeys = TableDecoder.getKeys(reader.result);
        this.csvFileJson = TableDecoder.csvToJson(reader.result, this.keys);
      } catch (err) {
        Helper.displayMessage(err, 0);
      }
    };

    reader.readAsText(this.csvFile);
  }

  /**
   * Starts the compilation process for a series document.
   */
  onGetSeriesFile(): void {
    if (!this.csvFileJson) {
      return;
    }
    this.compiler.replaceAndCompileSeries(this.templateName, this._mainTex.text, this.csvFileJson).subscribe(
      url => this.safeUri = url,
      err => Helper.displayMessage(err, 0)
    );
  }

  ngOnInit() {
    this.titleService.setTitle(`${Config.APP_NAME}`);

    $(document).ready(function () {
      $('.modal').modal();
      $('.tooltipped').tooltip({delay: 50});
    });
  }
}
