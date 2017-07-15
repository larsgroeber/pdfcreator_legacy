import { Component, OnInit } from '@angular/core';
import {TemplateI} from '../../../server/interfaces/template';
import {ActivatedRoute, ParamMap } from '@angular/router';
import {TemplateService} from '../services/template.service';
import {mFile} from '../interfaces/mfile';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss']
})
export class EditTemplateComponent implements OnInit {

  public template: TemplateI;
  public files: mFile[];

  public showCompiledPDF = false;
  public showMoreOptions = false;

  constructor(private route: ActivatedRoute
            , private templateService: TemplateService) { }

  onTemplateInfoChange(): void {
    this.templateService.template = this.template;
  }

  ngOnInit() {
    this.route.paramMap.switchMap((params: ParamMap) => {
      return this.templateService.getOneDoc(params.get('name'))
    })
    .subscribe((res: { template: TemplateI, files: mFile[]}) => {
      this.template = res.template;
      this.files = res.files;
    })
  }

}
