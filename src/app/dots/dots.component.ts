import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../data.service";
import {SocketService} from "../socket.service";

@Component({
  selector: 'app-dots',
  templateUrl: './dots.component.html',
  styleUrls: ['./dots.component.scss']
})
export class DotsComponent implements OnInit {

  settingsModal = false;

  constructor(public router: Router, public svc: DataService, private  socket: SocketService) { }

  ngOnInit(): void {
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    this.router.navigate(['auth/login']);
    this.socket.emit('logout', {});
    this.socket.socketConnection = true;
  }

  @HostListener('window:click', ['$event.target.className'])
  onClick(e) {
    if (e != 'exit' && e != 'settingsModal' && e != 'dots') {
      this.settingsModal = false;
    }
  }

}
