import { Injectable } from '@angular/core';
import {TemplateI} from "../../../server/interfaces/template";
import {mFile} from "../interfaces/mfile";
import {APIService} from "./api.service";
import {Observable} from "rxjs/Observable";
import {Helper} from "../../include/helper";
import {Subject} from 'rxjs/Subject';

@Injectable()
export class TemplateService {
  private _template: TemplateI;
  private _files: mFile[];
  private _needsSave: boolean = false;

  constructor(private api: APIService) { }

  get template(): TemplateI {
    return this._template;
  }

  set template(value: TemplateI) {
    if (this._template !== value) {
      this._template = value;
      this._needsSave = true;
    }
  }

  get files(): mFile[] {
    return this._files;
  }

  set files(value: mFile[]) {
    if (this._files !== value) {
      this._files = value;
      this._needsSave = true;
    }
  }

  get needsSave(): boolean {
    return this._needsSave;
  }

  set needsSave(value: boolean) {
    this._needsSave = value;
  }

  // notify subscribers that template changed
  private filesChanged = new Subject();
  filesChangedOb = this.filesChanged.asObservable();
  private onTemplateChange(): void {
    this.filesChanged.next();
  }

  getOneDoc(templateName: string): Observable<{ template: TemplateI, files: mFile[] }> {
    return Observable.create(observer => {
      if (templateName) {
        this.api.getOneDoc(templateName).subscribe(res => {
          observer.next(res);
          this._needsSave = false;
          this._template = res.template;
          this._files = res.files;
          console.log(`Loaded ${this._template.name}`, this._files);
          this.onTemplateChange();
        }, err => observer.error(err))
      } else {
        observer.error('No template specified!');
      }
    })
  }

  saveTemplate(): Observable<{ template: TemplateI, files: mFile[] }> {
    return Observable.create(observer => {
      if (this._template && this._files && this._needsSave) {
        this.api.updateDoc(this._template, this._files).subscribe(
          res => {
            observer.next(res);
            this._needsSave = false;
            console.log('Saved ' + this._template.name);
            Helper.displayMessage('Files saved');
          }
          , err => observer.error(err)
        );
      } else {
        observer.next();
      }
    });
  }
}
