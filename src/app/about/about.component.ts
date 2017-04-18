import { Component, OnInit } from '@angular/core';

import * as Config from '../../../config';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  version: string = Config.APP_VERSION;

  constructor() { }

  ngOnInit() {
  }

}
