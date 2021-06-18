import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  logins = 'adsasd';

  constructor(public svc: DataService, public router: Router, private activatedRoute: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.svc.loginValue = '';
    this.svc.passwordValue = '';
    this.svc.emailValue = '';
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {

  }

  login(): void {
    let error = false;
    this.svc.errorsFormAuth = {
      login: '',
      password: '',
      email: '',
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
    function validateEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    }
    let error = false;
    this.svc.errorsFormAuth = {
      login: '',
      password: '',
      email: '',
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
    if (this.svc.emailValue.length == 0) {
      this.svc.errorsFormAuth.email = 'Обязательно';
      error = true;
    } else if (!validateEmail(this.svc.emailValue)) {
      this.svc.errorsFormAuth.email = 'Некорректная почта';
      error = true;
    }

    if (!error) {
      this.svc.register();
    }

  }

  setType(type): void {
    this.svc.errorsFormAuth = {
      login: '',
      password: '',
      email: '',
      api: ''
    };
    if (type == 'login') {
      this.router.navigate(['auth/register']);
    } else {
      this.router.navigate(['auth/login']);
    }
  }

}
