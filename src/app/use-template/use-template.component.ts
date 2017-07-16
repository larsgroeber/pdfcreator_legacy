import {Component, OnInit} from '@angular/core';
import {Replacement} from '../interfaces/replacement';
import {SafeUrl} from '@angular/platform-browser';
import {mFile} from '../interfaces/mfile';
import {TemplateI} from '../../../server/interfaces/template';
import {CompilerService} from '../services/compiler.service';
import {TemplateService} from '../services/template.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Helper} from '../../include/helper';
import {TableDecoder} from '../../include/table-decoder';

import * as _ from 'lodash';

declare const $;

@Component({
  selector: 'app-use-template',
  templateUrl: './use-template.component.html',
  styleUrls: ['./use-template.component.scss']
})
export class UseTemplateComponent implements OnInit {

  public safeUri: SafeUrl;
  public replacements: Replacement[];
  public keys: string[];
  public error: string;
  public viewTabs = false;

  /**
   * Untouched main.tex file.
   */
  private _mainTex: mFile;
  public template: TemplateI;

  public csvFile: File;
  public csvFileJson: JSON;
  public csvFileKeys: string[];

  constructor(private templateService: TemplateService
    , private compilerService: CompilerService
    , private route: ActivatedRoute) {
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
    $(document).ready(function () {
      $('.tooltipped').tooltip({delay: 50});
    });
    this.templateService.getOneDoc(this.template.name).subscribe(data => {
      this._mainTex = data.files.find(f => f.name === 'main.tex');
      if (!this._mainTex) {
        Helper.displayMessage('Could not find main.tex!', 0);
        return;
      }
      this.replacements = [];
      this.keys = this.compilerService.getKeys(this._mainTex.text);
      _.each(this.keys, (e: string) => {
        this.replacements.push({
          name: e
        });
      });
      this.genPDF();
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
    this.compilerService.replaceAndCompile(this.template.name, this._mainTex.text, values).subscribe(
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
    this.compilerService.replaceAndCompileSeries(this.template.name, this._mainTex.text, this.csvFileJson).subscribe(
      url => this.safeUri = url,
      err => Helper.displayMessage(err, 0)
    );
  }

  ngOnInit() {
    this.route.paramMap.switchMap((params: ParamMap) => {
      return this.templateService.getOneDoc(params.get('name'))
    })
      .subscribe(() => {
        this.template = this.templateService.template;
        this.onUpdatePDF();
      });

    $(document).ready(function () {
      $('.modal').modal();
      $('.tooltipped').tooltip({delay: 50});
    });
  }

}
