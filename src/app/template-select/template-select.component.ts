/**
 * Displays all available templates.
 * TODO: Add preview
 * @author Lars Gröber
 */

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {APIService} from '../services/api.service';
import {Helper} from '../../include/helper';
import {TemplateI} from '../../../server/interfaces/template';
import {ActivatedRoute, NavigationStart, ParamMap, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

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

  private url: string;

  @ViewChild('select') select: ElementRef;

  showOnlyActive: boolean = false;

  constructor(private apiService: APIService
    , private router: Router
    , private route: ActivatedRoute) {
    this.router.events
      .debounce(() => Observable.timer(500))
      .filter(e => e instanceof NavigationStart)
      .subscribe(val => {
        this.checkTemplateName();
      })
  }

  onSelect(templateName: string): void {
    if (templateName) {
      this.router.navigate([this.url, templateName])
    }
  }

  reloadTemplates(callback): void {
    this.apiService.getAllDocs().subscribe(docs => {
        this.templates = docs;
        this.templatesActive = this.templates.filter(t => t.active);
        this.templatesInactive = this.templates.filter(t => !t.active);
        if (callback) callback();
      },
      err => Helper.displayMessage(err));
  }

  selectTemplate(name: string): void {
    $(document).ready(() => {
      $('select').val(name);
      $('select').material_select();
    });
  }

  private checkTemplateName(): void {
    let name: string;
    if (this.route.firstChild) {
      this.route.firstChild.params.subscribe((params: ParamMap) => {
        name = params['name'] ? params['name'] : '';

        if (this.templates && !this.templates.find(t => t.name === name)) {
          this.reloadTemplates(() => this.selectTemplate(name));
        } else {
          this.selectTemplate(name);
        }
      })
    } else {
      this.reloadTemplates(() => this.selectTemplate(''));
    }
  }

  ngOnInit() {
    if (this.router.url.split('/').indexOf('edit') != -1) {
      this.url = `edit`;
    } else if (this.router.url.split('/').indexOf('use') != -1) {
      this.url = `use`;
      this.showOnlyActive = true;
    }

    this.reloadTemplates(() => {
      this.checkTemplateName();
    });
  }

  ngAfterViewInit(): void {
    // hack to get selected element because materializecss changes dom
    $(this.select.nativeElement).on('change', () => {
      let list = this.select.nativeElement.getElementsByClassName('active selected')[0];
      this.onSelect(list.getElementsByTagName('span')[0].innerHTML);
    })
  }
}
