import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser/src/security/dom_sanitization_service';
import {NotifyService} from "../services/notify.service";

declare let $: any;
declare let Materialize: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
    $("#side-nav-toggle").sideNav();
  }
}
