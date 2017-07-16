/**
 * @file template.service.ts
 *
 * Keeps track of template and files, takes care of all saving and reloading.
 *
 * @author Lars Gröber
 */

import {Injectable} from '@angular/core';
import {TemplateI} from '../../../server/interfaces/template';
import {mFile} from '../interfaces/mfile';
import {APIService} from './api.service';
import {Observable} from 'rxjs/Observable';
import {Helper} from '../../include/helper';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class TemplateService {

  private _template: TemplateI;
  private _files: mFile[];
  private _needsSave: boolean = false;

  constructor(private api: APIService) {
  }

  /**
   * Getter and Setters.
   */
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

  reloadTemplate(): void {
    this.getOneDoc(this._template.name).subscribe();
  }

  /**
   * Notify subscribers that template changed.
   */
  private filesChanged = new Subject();
  filesChangedOb = this.filesChanged.asObservable();

  private onTemplateChange(): void {
    this.filesChanged.next();
  }

  /**
   * Calls the server and gets one document.
   * @param templateName
   * @return {any}
   */
  getOneDoc(templateName: string): Observable<{ template: TemplateI, files: mFile[] }> {
    return Observable.create(observer => {
      if (templateName) {
        this.api.getOneDoc(templateName).subscribe(res => {
          this._needsSave = false;
          this._template = res.template;
          this._files = res.files;
          console.log(`Loaded ${this._template.name}`, this._files);
          this.onTemplateChange();
          observer.next(res);
        }, err => observer.error(err))
      } else {
        observer.error('No template specified!');
      }
    })
  }

  /**
   * Saves the document to the server.
   * @return {any}
   */
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

  deleteTemplate(): Observable<{}> {
    return Observable.create(observer => {
      if (this._template) {
        this.api.deleteDoc(this._template).subscribe(
          res => {
            console.log(`Deleted ${this._template.name}`);
            this._template = null;
            this._files = null;
            observer.next(res);
            Helper.displayMessage('Template deleted');
          },
          err => observer.error(err)
        )
      } else {
        observer.next();
      }
    })
  }

  createTemplate(name: string): Observable<mFile> {
    return Observable.create(observer => {
      if (name) {
        this.api.createNewDoc(name).subscribe(
          res => {
            this._template = res.template;
            this._files = res.files;
            console.log(`Created ${this._template.name}`);
            observer.next(res);
            Helper.displayMessage('Template created');
          },
          err => observer.error(err)
        )
      } else {
        observer.next();
      }
    })
  }
}
