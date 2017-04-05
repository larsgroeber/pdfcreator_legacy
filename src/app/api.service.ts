/**
 * @file latex.service.ts
 *
 * Takes care of the document CRUD system and compilation of latex.
 *
 * @author Lars Gröber
 */

import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';
import * as Config from "../../config";

interface mFile {
  name: string,
  text: string,
}

const URL = Config.SERVER_URL + Config.ROOT_URL;

@Injectable()
export class APIService {
  constructor(private http: Http) {
  }

  ////// Methods for document CRUD system //////

  getAllDocs(): Observable<string[]> {
    return this.http.get(URL + 'api/latex/get/all', {} )
      .map(res => res.json().documents)
      .catch(APIService.handleError);
  }

  getOneDoc(docName: string): Observable<mFile[]> {
    return this.http.post(URL + 'api/latex/get/one', { name: docName } )
      .map(res => res.json().files)
      .catch(APIService.handleError);
  }

  createNewDoc(docName: string): Observable<string> {
    return this.http.post(URL + 'api/latex/create/one', { name: docName } )
      .map(res => res.text())
      .catch(APIService.handleError);
  }

  updateDoc(docName: string, files: mFile[]): Observable<mFile[]> {
    return this.http.post(URL + 'api/latex/update/one', { name: docName, files: files } )
      .map(res => res.json().files)
      .catch(APIService.handleError);
  }

  deleteDoc(docName: string): Observable<string> {
    return this.http.post(URL + 'api/latex/delete/one', { name: docName } )
      .map(res => res.text())
      .catch(APIService.handleError);
  }

  ////// End CRUD system //////

  convertLatex(docName: string, latex: string): Observable<string> {
    return this.http.post(URL + 'api/latex/convert', { name: docName, latex: latex })
      .map(res => res.text())
      .catch(APIService.handleError);
  }

  // see angular 2 guides
  public static handleError(error: Response | any) {
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
