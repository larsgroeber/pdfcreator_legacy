/**
 * @file texteditor.component.ts
 *
 * Simple text editor, has two way binding for text content.
 *
 * @author Lars Gröber
 */

import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {LatexService} from "../latex-editor-old/latex.service";
import {TemplateService} from '../services/template.service';
import {file} from 'babel-types';
import {mFile} from '../interfaces/mfile';

declare let $: any;
declare let Materialize: any;

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})

export class TextEditorComponent implements OnInit {
  @Input() set file(file: mFile) {
    if (this.templateService.files && file) {
      this.fileRef = this.templateService.files.find((f) => f === file);
      if (!this.fileRef) {
        console.error(`File ${file.name} does not exist on template!`);
        return;
      }
      this.text = this.fileRef.text;
      this.onTextChange();
    }
  };

  public text: string;
  private fileRef: mFile;

  constructor(private templateService: TemplateService) {
  }

  /**
   * Gets called whenever the text changes and communicates these changes with the service.
   */
  onTextChange(): void {
    // hack to resize textarea
    $('#latex-text').val(this.text);
    $('#latex-text').trigger('autoresize');
    Materialize.updateTextFields();

    if (this.fileRef.text !== this.text) {
      this.fileRef.text = this.text;
      this.templateService.needsSave = true;
    }
  }

  ngOnInit(): void {
  }
}
