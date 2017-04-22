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
import * as Config from "../../../config";
import {TemplateI} from "../../../server/interfaces/template";

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

  getAllDocs(): Observable<TemplateI[]> {
    return this.http.get(URL + 'api/template/get_all', {} )
      .map(res => res.json().templates)
      .catch(APIService.handleError);
  }

  getOneDoc(docName: string): Observable<mFile[]> {
    return this.http.post(URL + 'api/template/get', { name: docName } )
      .map(res => res.json().files)
      .catch(APIService.handleError);
  }

  createNewDoc(docName: string): Observable<{ template: TemplateI, files: mFile[] }> {
    return this.http.post(URL + 'api/template/create', { name: docName } )
      .map(res => res.json())
      .catch(APIService.handleError);
  }

  updateDoc(template: TemplateI, files: mFile[]): Observable<{ template: TemplateI, files: mFile[] }> {
    return this.http.post(URL + 'api/template/update', { template: template, files: files } )
      .map(res => res.json())
      .catch(APIService.handleError);
  }

  deleteDoc(template: TemplateI): Observable<string> {
    return this.http.post(URL + 'api/template/delete', { template: template } )
      .map(res => res.text())
      .catch(APIService.handleError);
  }

  ////// End CRUD system //////

  login(username: string, password: string) {
    return this.http.post(URL + 'api/user/authenticate', { name: username, password: password })
      .map(res => {
        let user = res.json();
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      })
      .catch(APIService.handleError);
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  convertLatex(docName: string, latex: string): Observable<string> {
    return this.http.post(URL + 'api/template/convert', { name: docName, latex: latex })
      .map(res => res.text())
      .catch(APIService.handleError);
  }

  // see angular 2 guides
  public static handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
