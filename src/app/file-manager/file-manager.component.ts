import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {mFile} from '../interfaces/mfile';
import {TemplateService} from '../services/template.service';

declare const $: any;

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {

  public files: mFile[];
  public selectedFile: mFile = { name: "", text: "" };

  @Output() currentFileChanged: EventEmitter<mFile> = new EventEmitter();

  constructor(private templateService: TemplateService) {
    this.files = this.templateService.files;
  }

  onFileClick(file: mFile) {
    this.selectedFile = file;
    this.currentFileChanged.emit(this.selectedFile);
  }

  ngOnInit() {
    this.templateService.filesChangedOb.subscribe(() => {
      this.files = this.templateService.files;
    })

    $(document).ready(function () {
      $('.modal').modal();
    });
  }

}
