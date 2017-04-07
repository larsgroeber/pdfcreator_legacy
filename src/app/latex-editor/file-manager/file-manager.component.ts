/**
 * @file file-editor.component.ts
 *
 * Displays a file manager and is responsible for saving and creating files.
 * TODO: display warning if user closes window
 * TODO: keep track of if files need to be saved
 *
 * @author Lars Gröber
 */

import {Component, Input, OnInit} from '@angular/core';
import {LatexService} from '../services/latex.service';
import {NotifyService} from '../services/notify.service';
import {FileUploader} from 'ng2-file-upload';

import * as Config from '../../../config';
import {mFile} from '../mfile';

const URL = Config.SERVER_URL + Config.ROOT_URL + 'api/upload';

@Component({
  selector: 'app-file-editor',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})

export class FileManagerComponent implements OnInit {
  // files
  private files: mFile[];
  private selectedFile: mFile = { name: '', text: ''};

  // info box
  public info: string;
  public infoClass: string;

  // new files
  public fileName: string;
  public uploader: FileUploader = new FileUploader({ url: URL });
  public showNewFileDialog = false;
  public showUploadFileDialog = false;

  @Input() docName: string;

  constructor(private latex: LatexService, private notify: NotifyService) {
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
    if (!this.files) return;
    console.log('Save files ' + this.docName);
    this.latex.updateDoc(this.docName, this.files).subscribe(files => {
      this.showInfo('Files saved!');
    }, err => this.showInfo(err, 'error'));
  }

  /**
   * Deletes the selected file from files.
   */
  deleteFile(): void {
    const index = this.files.indexOf(this.selectedFile);
    if (index !== -1) {
      this.files.splice(index, 1);
      this.notify.onTextChange('');
    }
  }

  /**
   * Helper function to display information in the info box.
   * @param text
   * @param logLevel
   */
  showInfo(text: string, logLevel?: string): void {
    if (!logLevel) logLevel = 'log';
    switch (logLevel) {
      case 'log':
        this.infoClass = 'alert-info';
        break;
      case 'error':
        this.infoClass = 'alert-danger';
    }
    this.info = text;
    setTimeout(() => { this.info = ''; }, 3000);
  }

  /**
   * Called when the user uploads a file.
   */
  onFileUpload(): void {
    this.uploader.onBuildItemForm = (item, form) => {
      form.append('name', this.docName);
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status);
      if (status !== 200) {
        this.showInfo('There was a problem uploading the file!', 'error');
      } else {
        this.showInfo('File uploaded!');
      }
      this.reloadFiles();
      this.showUploadFileDialog = false;
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
    this.showNewFileDialog = false;
  }

  /**
   * Fetches files from the server.
   */
  reloadFiles(): void {
    console.log('Reload files ' + this.docName);
    this.latex.getOneDoc(this.docName).subscribe((files) => {
      this.files = files;
      this.selectedFile = this.files.find(f => f.name === 'main.tex');
      if (this.selectedFile) {
        this.notify.onTextChange(this.selectedFile.text);
      }
    });
  }

  ngOnInit() {
    // listen to notify events
    this.notify.textChangeOb.subscribe(text => {
      if (this.selectedFile) {
        this.selectedFile.text = text;
      }
    });
    this.notify.saveFilesOb.subscribe(docName => {
      this.saveFiles();
    });
    this.notify.loadDocOb.subscribe(newDocName => {
      this.saveFiles();
      this.docName = newDocName;
      this.reloadFiles();
    });
  }
}
