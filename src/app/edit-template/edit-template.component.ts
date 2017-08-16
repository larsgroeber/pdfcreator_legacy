import {Component, OnInit} from '@angular/core';
import {TemplateI} from '../../../server/interfaces/template';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {TemplateService} from '../services/template.service';
import {mFile} from '../interfaces/mfile';
import {Helper} from '../../include/helper';
import {CompilerService} from '../services/compiler.service';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss']
})
export class EditTemplateComponent implements OnInit {

  public template: TemplateI;
  public files: mFile[];

  public replacementKeys: string[];
  public safeURL: SafeUrl;

  public showCompiledPDF = false;
  public showMoreOptions = false;

  constructor(private route: ActivatedRoute
    , private router: Router
    , private templateService: TemplateService
    , private compilerService: CompilerService) {
  }

  onCompilePDF(): void {
    const mainTex = this.files.find(f => f.name === 'main.tex');
    if (!mainTex) {
      Helper.displayMessage('Could not find main.tex', 1);
      return;
    }
    this.showCompiledPDF = true;
    this.replacementKeys = this.compilerService.getKeys(mainTex.text);
    this.compilerService.compileLatex(this.template.name, mainTex.text).subscribe(
      url => this.safeURL = url,
      err => Helper.displayMessage(err, 1)
    );
  }

  onTemplateInfoChange(): void {
    this.templateService.needsSave = true;
  }

  // TODO: templateSelect does not work as intended
  onDelete(): void {
    this.templateService.deleteTemplate().subscribe(
      res => {
        this.router.navigate(['edit']);
      }
    )
  }

  ngOnInit() {
    this.route.paramMap.switchMap((params: ParamMap) => {
      const name = params.get('name');
      if (name) {
        return this.templateService.getOneDoc(name)
      }
    })
      .subscribe(() => {
        this.template = this.templateService.template;
        this.files = this.templateService.files;
        this.showCompiledPDF = false;
    })
  }

}
