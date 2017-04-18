/**
 * @file file-editor.component.ts
 *
 * Displays a file manager and is responsible for saving and creating files.
 * TODO: display warning if user closes window
 *
 * @author Lars Gröber
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {APIService} from "../../api.service";
import {LatexService} from "../latex.service";
import {FileUploader} from "ng2-file-upload";

import * as Config from '../../../../config';
import {mFile} from "../../interfaces/mfile";
import {Helper} from "../../../include/helper";
import {TemplateI} from "../../../../server/interfaces/template";

declare let $: any;

const URL = Config.SERVER_URL + Config.ROOT_URL + 'api/upload';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})

export class FileManagerComponent implements OnInit {
  // files
  private files: mFile[];
  private selectedFile: mFile = { name: '', text: ''};

  private _needsSave = false;

  // info box
  public info: string;

  // new files
  public fileName: string;
  public uploader: FileUploader = new FileUploader({ url: URL });

  public showNewFileDialog = false;
  public showUploadFileDialog = false;

  @Input() template: TemplateI;

  @Output() onTemplateLoadComplete: EventEmitter<void> = new EventEmitter<void>();

  constructor(private latex: APIService, private notify: LatexService) {
  }

  /**
   * Changes the currently selected File and updates the model.
   * @param file
   */
  onFileClick(file: mFile): void {
    this.selectedFile = file;
    this.notify.onTextChange(file.text);
  }

  /**
   * Is called whenever all files should be saved.
   */
  saveFiles(): void {
    if (!this.files || !this._needsSave) return;
    console.log('Save files ' + this.template.name);
    this.latex.updateDoc(this.template, this.files).subscribe(files => {
      if (files) {
        Helper.displayMessage('Files saved!');
      }
      this._needsSave = false;
    }, err => Helper.displayMessage(err, 0));
  }

  /**
   * Deletes the selected file from files.
   */
  deleteFile(): void {
    const index = this.files.indexOf(this.selectedFile);
    if (index !== -1) {
      this.files.splice(index, 1);
      this.notify.onTextChange('');
      this._needsSave = true;
    }
  }

  /**
   * Called when the user uploads a file.
   */
  onFileUpload(): void {
    this.uploader.onBuildItemForm = (item, form) => {
      form.append('name', this.template);
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status);
      if (status !== 200) {
        Helper.displayMessage("There was a problem uploading the file!", 0);
      } else {
        Helper.displayMessage("File uploaded!");
      }
      this.reloadFiles();
      this.showUploadFileDialog = false;
      this._needsSave = true;
    };
    this.uploader.uploadAll();
  }

  /**
   * Called when the user creates a new file.
   */
  onNewFileSave(): void {
    this.files.push({
      name: this.fileName,
      text: '',
    });
    this.onFileClick(this.files[this.files.length - 1]);
    this._needsSave = true;
    this.showNewFileDialog = false;
  }

  /**
   * Fetches files from the server.
   */
  reloadFiles(): void {
    console.log('Reload files ' + this.template.name);
    this.latex.getOneDoc(this.template.name).subscribe((files) => {
      this.files = files;
      this.selectedFile = this.files.find(f => f.name === 'main.tex');
      if (this.selectedFile) {
        this.notify.onTextChange(this.selectedFile.text);
      }
      this.onTemplateLoadComplete.emit();
    });
  }

  ngOnInit() {
    // listen to notify events
    this.notify.textChangeOb.subscribe(text => {
      if (this.selectedFile && this.selectedFile.text !== text) {
        this._needsSave = true;
        this.selectedFile.text = text;
      }
    });
    this.notify.saveFilesOb.subscribe(docName => {
      this.saveFiles();
    });
    this.notify.loadDocOb.subscribe(newDocName => {
      this.saveFiles();
      this.template = newDocName;
      this.reloadFiles();
    });
    this.notify.descriptionChangedOb.subscribe(() => {
      this._needsSave = true;
    });

    $(document).ready(function(){
      $('.modal').modal();
    });
  }
}
