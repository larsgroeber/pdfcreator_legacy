/**
 * Displays all available templates.
 * TODO: Add preview
 * @author Lars Gröber
 */

import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {APIService} from "../services/api.service";
import {Helper} from "../../include/helper";
import {LatexService} from "../latex-editor-old/latex.service";
import {TemplateI} from "../../../server/interfaces/template";
import {showWarningOnce} from "tslint/lib/error";
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

declare let $: any;

@Component({
  selector: 'app-template-select',
  templateUrl: './template-select.component.html',
  styleUrls: ['./template-select.component.scss']
})
export class TemplateSelectComponent implements OnInit, AfterViewInit {
  public templates: TemplateI[];
  public templatesActive: TemplateI[];
  public templatesInactive: TemplateI[];

  @ViewChild('select') select: ElementRef;

  @Input() showOnlyActive: boolean = false;

  constructor(private latex: APIService
            , private notify: LatexService
            , private router: Router) {
  }

  onSelect(templateName: string): void {
    if (templateName) {
      let url = '';
      // TODO: Figure out how to handle this better!
      if (this.router.url.split('/').indexOf('edit') != -1) {
        url = `edit`;
      } else if (this.router.url.split('/').indexOf('use') != -1) {
        url = `use`;
      }
      this.router.navigate([url, templateName])
    }
  }

  reloadTemplates(selectedName: string): void {
    this.latex.getAllDocs().subscribe(docs => {
        this.templates = docs;
        this.templatesActive = this.templates.filter(t => t.active);
        this.templatesInactive = this.templates.filter(t => !t.active);
        $(document).ready(() => {
          $('select').val(selectedName);
          $('select').material_select();
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
