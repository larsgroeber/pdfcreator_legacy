import { Injectable } from '@angular/core';
import {APIService} from "./api.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Helper} from "../../include/helper";
import {Template} from "../../include/Template";

@Injectable()
export class CompilerService {

  constructor(private api: APIService, private sanitizer: DomSanitizer) { }

  public getKeys(mainTex: string): string[] {
    let template = new Template(mainTex);
    return template.getKeys();
  }

  public replaceAndCompile(docName: string, mainTex: string, values: Object, callback): void {
    let template = new Template(mainTex);
    return this.compileLatex(docName, template.replace(values), callback);
  }

  public compileLatex(docName: string, mainTex: string, callback): void {
    mainTex = Template.removeComments(Template.removeVariablesAndStatements(mainTex));
    this.api.convertLatex(docName, mainTex).subscribe((data) => {
      callback(this.makeSafeURL(data));
    }, (err) => {
      Helper.displayMessage(err, 0);
    });
  }

  public replaceAndCompileSeries(docName: string, mainTex: string, values, callback): void {
    let docs: string[] = [];
    let template = new Template(mainTex);
    for (let value of values) {
      docs.push(Template.removeComments(Template.removeVariablesAndStatements(template.replace(value))));
    }
    return this.complileLatexSeries(docName, docs, callback);
  }

  public complileLatexSeries(docName: string, mainTexArray: string[], callback): void {
    this.api.convertLatexSeries(docName, mainTexArray).subscribe(data => {
      callback(this.makeSafeURL(data));
    }, err => {
      Helper.displayMessage(err, 0);
    });
  }

  private makeSafeURL(unsafe: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(unsafe);
  }
}
