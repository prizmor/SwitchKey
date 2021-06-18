import {Component, HostListener, OnInit} from '@angular/core';
import {DataService} from "../data.service";
import {SocketService} from "../socket.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  message = false;

  constructor(private svc: DataService, public socket: SocketService) { }

  ngOnInit(): void {
  }

  isMessage() {
    this.message = !this.message;
    if (!this.message) {
      this.socket.emit('deleteMessage', {});
      this.socket.listen('deleteMessageComplete').subscribe(data => {
        this.svc.getMessage();
      });
    }
  }

  @HostListener('window:click', ['$event.target.className'])
  onClick(e) {
    if (e != 'title' && e != 'indicator' && e != 'items' && e != 'item' && e != 'bell' && e != '') {
      this.message = false;
    }
  }

}
