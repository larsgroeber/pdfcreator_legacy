import {Component, OnInit} from '@angular/core';
import {APIService} from "../api.service";
import {Helper} from "../../include/helper";

declare let $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
      // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
      $('.modal').modal();
      $("#side-nav-toggle").sideNav();
    });
    this.currentUser = localStorage.getItem('currentUser');
  }
}
