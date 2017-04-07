/**
 * Displays all available templates.
 * TODO: Add preview
 * @author Lars Gröber
 */

import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {APIService} from "../api.service";
import {Helper} from "../../include/helper";
import {LatexService} from "../latex-editor/latex.service";

declare let $: any;

@Component({
  selector: 'app-template-select',
  templateUrl: './template-select.component.html',
  styleUrls: ['./template-select.component.css']
})
export class TemplateSelectComponent implements OnInit, AfterViewInit {
  public templates: string[];

  @ViewChild('select') select: ElementRef;

  @Output() templateSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor(private latex: APIService, private notify: LatexService) { }

  onSelect(template: string): void {
    if (template) {
      this.templateSelected.emit(template);
    }
  }

  reloadTemplates(selected: string): void {
    this.latex.getAllDocs().subscribe(docs => {
        console.log(selected);
        this.templates = docs;
        $(document).ready(() => {
          $('select').material_select();
          $('select').val(selected);
        });
      },
      err => Helper.displayMessage(err));
  }

  ngOnInit() {
    this.notify.loadTemplatesOb.subscribe(selected => this.reloadTemplates(selected));
    this.reloadTemplates('');
  }

  ngAfterViewInit(): void {
    // hack to get selected element because materializecss changes dom
    $(this.select.nativeElement).on('change', () => {
      let list = this.select.nativeElement.getElementsByClassName('active selected')[0];
      this.onSelect(list.getElementsByTagName('span')[0].innerHTML);
    })
  }
}
