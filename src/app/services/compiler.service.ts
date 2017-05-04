/**
 * @file compiler.service.ts
 *
 * This service compiles the documents and works as a wrapper around the Template class.
 *
 * @author Lars Gröber
 */

import { Injectable } from '@angular/core';
import {APIService} from "./api.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Helper} from "../../include/helper";
import {Template} from "../../include/Template";
import {Observable} from "rxjs/Observable";

import * as _ from 'lodash';

@Injectable()
export class CompilerService {

  constructor(private api: APIService, private sanitizer: DomSanitizer) { }

  /**
   * Returns all keys in a given document.
   * @param mainTex   Content of the main.tex file
   */
  public getKeys(mainTex: string): string[] {
    let template = new Template(mainTex);
    // check each key for spaces
    let keys = template.getKeys();
    _.each(keys, k => {
      const re = new RegExp(' ');
      if (k.match(re)) {
        Helper.displayMessage(`Warning: Keys should not contain spaces but "${k}" does!`, 1);
      }
    });
    return keys;
  }

  /**
   * Replaces keys by given values and compiles document.
   * @param docName   Name of the document
   * @param mainTex   Content of the main.tex file
   * @param values    Values to replace keys with in the format values[key] = replacement
   */
  public replaceAndCompile(docName: string, mainTex: string, values: Object): Observable<SafeUrl> {
    let template = new Template(mainTex);
    return this.compileLatex(docName, template.replace(values));
  }

  /**
   * Simply compiles a latex document without replacing anything.
   * @param docName   Name of the document
   * @param mainTex   Content of the main.tex file
   */
  public compileLatex(docName: string, mainTex: string): Observable<SafeUrl> {
    mainTex = Template.removeComments(Template.removeVariablesAndStatements(mainTex));
    return Observable.create(observer => {
      this.api.convertLatex(docName, mainTex).subscribe((data) => {
        observer.next(this.makeSafeURL(data));
      }, (err) => {
        observer.error(err);
      });
    })

  }

  /**
   * Almost the same as replaceAndCompile but generates a series of documents.
   * @param docName   Name of the document
   * @param mainTex   Content of the main.tex file
   * @param values    Replacement values array in the format values[i][key] = replacement
   */
  public replaceAndCompileSeries(docName: string, mainTex: string, values): Observable<SafeUrl> {
    let docs: string[] = [];
    let template = new Template(mainTex);
    for (let value of values) {
      docs.push(Template.removeComments(Template.removeVariablesAndStatements(template.replace(value))));
    }
    return this.complileLatexSeries(docName, docs);
  }

  /**
   * Almost the same as compileLatex but calls api.convertLatexSeries.
   * @param docName       Name of the document
   * @param mainTexArray  Array of the contents of the different main.tex files which are to be generated
   */
  public complileLatexSeries(docName: string, mainTexArray: string[]): Observable<SafeUrl> {
    return Observable.create(observer => {
      this.api.convertLatexSeries(docName, mainTexArray).subscribe(data => {
        observer.next(this.makeSafeURL(data));
      }, err => {
        observer.error(err);
      });
    })

  }

  /**
   * "Makes" a data url safe
   * @param unsafe
   * @return {SafeResourceUrl}
   */
  private makeSafeURL(unsafe: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(unsafe);
  }
}
