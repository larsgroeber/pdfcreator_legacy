/**
 * @file file-editor.component.ts
 *
 * Displays a file manager and is responsible for saving files.
 *
 * @author Lars Gröber
 */

import {Component, Input, OnInit} from '@angular/core';
import {LatexService} from "../latex.service";
import {NotifyService} from "../notify.service";
import {FileUploader} from "ng2-file-upload";

import * as Config from '../../../config';

const URL = 'http://localhost:3000' + Config.ROOT_URL + 'api/upload';

interface mFile {
  name: string,
  text: string,
}

@Component({
  selector: 'app-file-editor',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})

export class FileManagerComponent implements OnInit {
  // TODO: get this from the server
  private files: mFile[];
  private selectedFile: mFile;
  public info: string;
  public fileName: string;
  public uploader: FileUploader = new FileUploader({ url: URL })
  public showNewFileDialog: boolean = false;
  public showUploadFileDialog: boolean = false;

  @Input() docName: string;

  constructor(private latex: LatexService, private notify: NotifyService) {
    this.notify.textChangeOb.subscribe(text => {
      this.selectedFile.text = text;
    });
    this.notify.saveFilesOb.subscribe(docName => {
      this.fileSave();
    });
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
  fileSave(): void {
    this.showInfo('Files saved!');
    this.latex.updateDoc(this.docName, this.files).subscribe(files => {
      this.files = files;
    });
  }

  showInfo(text: string): void {
    this.info = text;
    setTimeout(() => { this.info = '' }, 5000);
  }

  onFileUpload(): void {
    this.uploader.onBuildItemForm = (item, form) => {
      form.append('name', this.docName);
    };
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log("ImageUpload:uploaded:", item, status);
      this.showInfo("File uploaded!");
      this.reloadFiles();
    };
    this.uploader.uploadAll();
  }

  onNewFileSave(): void {
    this.files.push({
      name: this.fileName,
      text: '',
    });
    this.onFileClick(this.files[this.files.length - 1]);
    this.showNewFileDialog = false;
  }

  reloadFiles(): void {
    this.latex.getOneDoc(this.docName).subscribe((files) => {
      this.files = files;
      this.selectedFile = this.files.find(f => f.name === 'main.tex');
      this.notify.onTextChange(this.selectedFile.text);
    })
  }

  ngOnInit() {
    this.reloadFiles();
  }

}
