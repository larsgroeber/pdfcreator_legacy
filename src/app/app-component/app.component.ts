/**
 * @file app.component.ts
 *
 * Main app component: displays the navigation and side bar and takes care of user authentication for now
 * TODO: move user authentication somewhere else
 */

import {Component, OnInit} from '@angular/core';
import {APIService} from "../services/api.service";
import {Helper} from "../../include/helper";

declare let $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentUser;
  userName: string;
  password: string;

  constructor(private apiService: APIService) {
  }

  onLogin() {
    if (this.userName && this.password) {
      this.apiService.login(this.userName, this.password).subscribe(() => {
        this.currentUser = localStorage.getItem('currentUser');
        if (!this.currentUser) {
          Helper.displayMessage('Wrong username or password!', 1);
        }
      }, err => Helper.displayMessage(err, 0));

      this.userName = undefined;
      this.password = undefined;
    }
  }

  onLogout() {
    this.apiService.logout();
    this.currentUser = undefined;
  }

  ngOnInit(): void {
    $(document).ready(function(){
      $('.modal').modal();
      $("#side-nav-toggle").sideNav();
    });
    this.currentUser = localStorage.getItem('currentUser');
  }
}
