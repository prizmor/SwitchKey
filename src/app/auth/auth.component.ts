import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  type = 'login';

  constructor(public svc: DataService, public router: Router) { }

  ngOnInit(): void {
  }

  login(): void {
    let error = false;
    this.svc.errorsFormAuth = {
      login: '',
      password: '',
      api: ''
    };
    if (this.svc.loginValue.length == 0) {
      this.svc.errorsFormAuth.login = 'Обязательно';
      error = true;
    }
    if (this.svc.passwordValue.length == 0) {
      this.svc.errorsFormAuth.password = 'Обязательно';
      error = true;
    }
    if (!error) {
      this.svc.login();
    }
  }

  register(): void {
    let error = false;
    this.svc.errorsFormAuth = {
      login: '',
      password: '',
      api: ''
    };
    if (this.svc.loginValue.length == 0) {
      this.svc.errorsFormAuth.login = 'Обязательно';
      error = true;
    } else if (this.svc.loginValue.length < 4) {
      this.svc.errorsFormAuth.login = 'Не меньше 4 симоволов';
      error = true;
    }
    if (this.svc.passwordValue.length == 0) {
      this.svc.errorsFormAuth.password = 'Обязательно';
      error = true;
    } else if (this.svc.passwordValue.length < 4) {
      this.svc.errorsFormAuth.password = 'Не меньше 4 символов';
      error = true;
    }

    if (!error) {
      this.svc.register();
    }

  }

  setType(): void {
    this.svc.errorsFormAuth = {
      login: '',
      password: '',
      api: ''
    };
    this.svc.loginValue = '';
    this.svc.passwordValue = '';
    if (this.type == 'login') {
      this.type = 'register';
    } else {
      this.type = 'login';
    }
  }

}
