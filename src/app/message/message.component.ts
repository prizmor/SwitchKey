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

  isMessage(): void {
    this.message = !this.message;
  }

  deleteMessage(index: any): void {
    this.socket.emit('deleteMessage', {index: index});
    this.socket.listen('deleteMessageComplete').subscribe(data => {
      this.svc.getMessage();
    });
  }

  @HostListener('window:click', ['$event.target.className'])
  onClick(e): void {
    if (e != 'title' && e != 'indicator' && e != 'items' && e != 'item' && e != 'bell' && e != '') {
      this.message = false;
    }
  }

}
