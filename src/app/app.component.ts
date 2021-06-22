import { Component, HostListener, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "./data.service";
import {SocketService} from "./socket.service";
const { v4: uuidv4 } = require('uuid');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  textName = '';
  settingsModal = false;
  friends = false;
  message = true;

  constructor(public router: Router, public svc: DataService, private  socket: SocketService) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      //this.router.navigate(['/start']);
      this.socket.connect(localStorage.getItem('token'));
    } else {
      this.router.navigate(['/auth/login']);
    }
    this.svc.isInit();
  }

  addTextClick(): void {
    this.router.navigate(['/addText']);
  }

  openText(id: string): void {
    const url = 'text/' + id;
    this.router.navigate([url]);
    console.log(this.router.url);
  }

  openSettings(): void {
    this.router.navigate(['/settings/user']);
  }

  openFriends(): void {
    this.friends = !this.friends;
  }

  login(): string {
    return JSON.parse(localStorage.getItem('login'));
  }

  isStatus(): void {
    this.socket.emit('online', {});

  }

  isMessage(): void {
    this.message = !this.message;
  }

  @HostListener('window:keydown',['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (this.router.url != '/start') {
      if(($event.ctrlKey || $event.metaKey) && $event.keyCode == 84) {
        this.router.navigate(['/addText']);
      }
    }
  }
}

