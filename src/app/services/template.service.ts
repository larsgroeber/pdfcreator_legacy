import { Injectable } from '@angular/core';
import {TemplateI} from "../../../server/interfaces/template";
import {mFile} from "../interfaces/mfile";
import {APIService} from "./api.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class TemplateService {
  private _template: TemplateI;
  private _files: mFile[];

  constructor(private api: APIService) { }

  get template(): TemplateI {
    return this._template;
  }

  set template(value: TemplateI) {
    this._template = value;
  }

  get files(): mFile[] {
    return this._files;
  }

  set files(value: mFile[]) {
    this._files = value;
  }

  saveTemplate(): Observable<{ template: TemplateI, files: mFile[] }> {
    return Observable.create(observer => {
      if (this._template && this._files) {
        this.api.updateDoc(this._template, this._files).subscribe(
          res => observer.next(res)
          , err => observer.error(err)
        );
      } else {
        observer.next();
      }
    })
  }
}
