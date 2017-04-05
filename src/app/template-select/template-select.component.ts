/**
 * Displays all available templates.
 * TODO: Add preview
 * @author Lars Gröber
 */

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {APIService} from "../api.service";
import {Helper} from "../../include/helper";
import {LatexService} from "../latex-editor/latex.service";

declare let $: any;

@Component({
  selector: 'app-template-select',
  templateUrl: './template-select.component.html',
  styleUrls: ['./template-select.component.css']
})
export class TemplateSelectComponent implements OnInit {
  public templates: string[];
  public selected: string;

  @Output() templateSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor(private latex: APIService, private notify: LatexService) { }

  onSelect(): void {
    console.log(this.selected)
    this.templateSelected.emit(this.selected);
  }

  reloadTemplates(): void {
    this.latex.getAllDocs().subscribe(docs => {
        this.templates = docs;
      },
      err => Helper.displayMessage(err));
  }

  ngOnInit() {
    this.reloadTemplates();

    this.notify.loadTemplatesOb.subscribe(() => this.reloadTemplates());

    $(document).ready(function() {
      $('select').material_select();
    });
  }
}
