/**
 * @file texteditor.component.ts
 *
 * Simple text editor, has two way binding for text content.
 *
 * @author Lars Gröber
 */

import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {LatexService} from "../latex.service";
import {NotifyService} from "../notify.service";

@Component({
  selector: 'app-text-editor',
  templateUrl: 'text-editor.component.html',
  // styleUrls: ['']
})

export class TextEditorComponent implements OnInit {
  @Input() public text: string;
  @Output() public textChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private latex: LatexService, private notify: NotifyService) {
    this.notify.textChangeOb.subscribe(text => {
      this.text = text;
    })
  }

  /**
   * Gets called whenever the text changes and communicates these changes with the service.
   */
  onTextChange(): void {
    this.notify.onTextChange(this.text);
  }

  ngOnInit(): void {
  }
}
