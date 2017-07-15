import {Component, Input, OnInit} from '@angular/core';
import {mFile} from '../interfaces/mfile';

@Component({
  selector: 'app-latex-editor',
  templateUrl: './latex-editor.component.html',
  styleUrls: ['./latex-editor.component.scss']
})
export class LatexEditorComponent implements OnInit {

  public currentFile: mFile;

  constructor() { }

  currentFileChanged(event: mFile) {
    this.currentFile = event;
  }

  ngOnInit() {
  }

}
