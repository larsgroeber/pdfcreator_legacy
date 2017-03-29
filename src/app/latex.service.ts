/**
 * @file latex.service.ts
 *
 * Takes care of the document CRUD system and compilation of latex.
 *
 * @author Lars Gröber
 */

import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable, Subject,} from "rxjs";
import 'rxjs/add/operator/map';
import * as Config from "../../config";

interface mFile {
  name: string,
  text: string,
}

@Injectable()
export class LatexService {
  constructor(private http: Http) {
  }

  ////// Methods for document CRUD system //////

  getAllDocs(): Observable<string> {
    return this.http.get(Config.ROOT_URL + 'api/latex/get/all', {} )
      .map(res => res.text())
      .catch(this.handleError);
  }

  getOneDoc(docName: string): Observable<mFile[]> {
    return this.http.post(Config.ROOT_URL + 'api/latex/get/one', { name: docName } )
      .map(res => res.json().files)
      .catch(this.handleError);
  }

  createNewDoc(docName: string): Observable<string> {
    return this.http.post(Config.ROOT_URL + 'api/latex/create/one', { name: docName } )
      .map(res => res.text())
      .catch(this.handleError);
  }

  updateDoc(docName: string, files: mFile[]): Observable<mFile[]> {
    return this.http.post(Config.ROOT_URL + 'api/latex/update/one', { name: docName, files: files } )
      .map(res => res.json().files)
      .catch(this.handleError);
  }

  deleteDoc(docName: string): Observable<string> {
    return this.http.post(Config.ROOT_URL + 'api/latex/delete/one', { name: docName } )
      .map(res => res.text())
      .catch(this.handleError);
  }

  ////// End CRUD system //////

  convertLatex(latex: string): Observable<string> {
    return this.http.post(Config.ROOT_URL + 'api/convert', {latex: latex})
      .map(res => res.text())
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
