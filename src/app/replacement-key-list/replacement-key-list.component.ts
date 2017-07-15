import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-replacement-key-list',
  templateUrl: './replacement-key-list.component.html',
  styleUrls: ['./replacement-key-list.component.scss']
})
export class ReplacementKeyListComponent implements OnInit {

  @Input() replacementKeys: string[];

  constructor() { }

  ngOnInit() {
  }

}
