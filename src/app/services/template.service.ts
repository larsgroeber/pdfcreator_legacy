import { Injectable } from '@angular/core';
import {TemplateI} from "../../../server/interfaces/template";
import {mFile} from "../interfaces/mfile";
import {APIService} from "./api.service";

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

  saveTemplate(next: (result: { template: TemplateI, files: mFile[] }) => void,
               error: (err: any) => void): void {
    console.log(this._template, this._files);
    console.log('Save files ' + this._template.name);
    this.api.updateDoc(this._template, this._files).subscribe(next, error);
  }
}
