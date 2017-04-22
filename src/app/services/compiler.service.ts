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
    console.log(mainTex);
    this.api.convertLatex(docName, mainTex).subscribe((data) => {
      callback(this.makeSafeURL(data));
    }, (err) => {
      Helper.displayMessage(err, 0);
    });
  }

  private makeSafeURL(unsafe: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(unsafe);
  }
}
