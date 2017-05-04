/**
 * @file file-editor.component.ts
 *
 * Displays a file manager and is responsible for saving and creating files.
 * TODO: display warning if user closes window
 *
 * @author Lars Gröber
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {APIService} from '../../services/api.service';
import {LatexService} from '../latex.service';
import {FileUploader} from 'ng2-file-upload';

import * as Config from '../../../../config';
import {mFile} from '../../interfaces/mfile';
import {Helper} from '../../../include/helper';
import {TemplateI} from '../../../../server/interfaces/template';
import {TemplateService} from '../../services/template.service';
import {EditGuard} from '../../guards/edit.service';
import {Observable} from 'rxjs/Observable';

declare const $: any;

const URL_UPLOAD = Config.SERVER_URL + Config.ROOT_URL + 'api/template/upload';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})

export class FileManagerComponent implements OnInit {
  // files
  private files: mFile[];
  private selectedFile: mFile = {name: '', text: ''};

  // info box
  public info: string;

  // new files
  public fileName: string;
  public uploader: FileUploader = new FileUploader({url: URL_UPLOAD, authToken: 'Bearer ' + this.editGuard.jwt()});

  public showNewFileDialog = false;
  public showUploadFileDialog = false;

  @Input() template: TemplateI;

  @Output() templateLoadComplete: EventEmitter<void> = new EventEmitter<void>();
  @Output() saveFiles: EventEmitter<void> = new EventEmitter<void>();

  constructor(private apiService: APIService,
              private latexService: LatexService,
              private templateService: TemplateService,
              private editGuard: EditGuard) {
  }

  /**
   * Changes the currently selected File and updates the model.
   * @param file
   */
  onFileClick(file: mFile): void {
    this.selectedFile = file;
    this.latexService.onTextChange(file.text);
  }

  /**
   * Is called whenever all files should be saved.
   */
  onSaveFiles(): void {
    this.templateService.saveTemplate().subscribe(files => {}
    , err => Helper.displayMessage(err, 0));
  }

  /**
   * Deletes the selected file from files.
   */
  deleteFile(): void {
    const index = this.templateService.files.indexOf(this.selectedFile);
    if (index !== -1) {
      this.templateService.files.splice(index, 1);
      this.files = this.templateService.files;
      this.latexService.onTextChange('');
      this.templateService.needsSave = true;
    }
  }

  /**
   * Called when the user uploads a file.
   */
  onFileUpload(): void {
    console.log(this.uploader.queue);
    this.uploader.onBuildItemForm = (item, form) => {
      form.append('name', this.template.name);
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status);
      if (status !== 200) {
        Helper.displayMessage('There was a problem uploading the file!', 0);
      } else {
        Helper.displayMessage('File uploaded!');
      }
      this.reloadFiles();
      this.showUploadFileDialog = false;
      this.templateService.needsSave = true;
    };
    this.uploader.uploadAll();
  }

  /**
   * Called when the user creates a new file.
   */
  onNewFileSave(): void {
    this.templateService.files.push({
      name: this.fileName,
      text: '',
    });
    this.files = this.templateService.files;
    this.onFileClick(this.templateService.files[this.templateService.files.length - 1]);
    this.showNewFileDialog = false;
    this.templateService.needsSave = true;
  }

  /**
   * Fetches files from the server.
   */
  reloadFiles(): void {
    console.log('Reload files ' + this.template.name);
    this.apiService.getOneDoc(this.template.name).subscribe((files) => {
      this.templateService.files = files;
      this.files = this.templateService.files;
      this.selectedFile = this.templateService.files.find(f => f.name === 'main.tex');
      if (this.selectedFile) {
        this.latexService.onTextChange(this.selectedFile.text);
      }
    });
  }

  ngOnInit() {
    // listen to notify events
    this.latexService.textChangeOb.subscribe(text => {
      if (this.selectedFile && this.selectedFile.text !== text) {
        this.selectedFile.text = text;
        this.templateService.needsSave = true;
      }
    });
    // this.latexService.saveFilesOb.subscribe(docName => {
    //   this.onSaveFiles();
    // });
    this.latexService.loadDocOb.subscribe(newDocName => {
      this.template = newDocName;
      this.reloadFiles();
    });
    // this.latexService.templateChangedOb.subscribe(() => {
    //   this._needsSave = true;
    // });

    $(document).ready(function () {
      $('.modal').modal();
    });
  }
}
