/**
 * @file file-manager.component.ts
 *
 * File manager, shows available files and takes care of saving, deleting and creating new files.
 *
 * @author Lars Gröber
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {mFile} from '../interfaces/mfile';
import {TemplateService} from '../services/template.service';
import {Helper} from '../../include/helper';

import * as Config from '../../../config';
import {FileUploader} from 'ng2-file-upload';
import {EditGuard} from '../guards/edit.service';

declare const $: any;

const URL_UPLOAD = Config.SERVER_URL + Config.ROOT_URL + 'api/template/upload';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {

  public files: mFile[];
  public selectedFile: mFile = {name: '', text: ''};

  public newFileName: string;

  public uploader: FileUploader = new FileUploader({url: URL_UPLOAD, authToken: 'Bearer ' + this.editGuard.jwt()});

  @Output() currentFileChanged: EventEmitter<mFile> = new EventEmitter();

  constructor(private templateService: TemplateService
    , private editGuard: EditGuard) {
  }

  onFileClick(file: mFile) {
    this.selectedFile = file;
    this.currentFileChanged.emit(this.selectedFile);
  }

  onSave(): void {
    this.templateService.saveTemplate().subscribe(
      res => ''
      , err => Helper.displayMessage(err, 0)
    )
  }

  /**
   * Deletes the selected file.
   */
  onDeleteFile(): void {
    const index = this.files.indexOf(this.selectedFile);
    this.files.splice(index, 1);
    this.templateService.needsSave = true;
  }

  onNewFile(fileName: string): void {
    let newFile: mFile = {name: fileName, text: ''};
    this.files.push(newFile);
    this.templateService.needsSave = true;
    this.onFileClick(newFile);
  }

  /**
   * Called when the user uploads a file.
   */
  onFileUpload(): void {
    console.log(this.uploader.queue);
    this.uploader.onBuildItemForm = (item, form) => {
      form.append('name', this.templateService.template.name);
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status);
      if (status !== 200) {
        Helper.displayMessage('There was a problem uploading the file!', 0);
      } else {
        Helper.displayMessage('File uploaded!');
        this.templateService.reloadTemplate();
      }
    };
    this.uploader.uploadAll();
  }

  private getNewFiles(): void {
    this.files = this.templateService.files;
    const mainTex = this.files.find(f => f.name === 'main.tex');
    if (mainTex) {
      this.onFileClick(mainTex);
    }
  }

  ngOnInit() {
    this.templateService.filesChangedOb.subscribe(() => {
      this.getNewFiles();
    });
    this.getNewFiles();

    $(document).ready(function () {
      $('.modal').modal();
    });
  }

}
