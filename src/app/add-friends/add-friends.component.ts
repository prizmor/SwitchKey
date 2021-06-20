import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../data.service";
import {SocketService} from "../socket.service";

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.component.html',
  styleUrls: ['./add-friends.component.scss']
})
export class AddFriendsComponent implements OnInit {

  userLogin = '';
  message = '';

  constructor(public router: Router, public svc: DataService, private  socket: SocketService) { }

  addFriends(): void {
    if (this.userLogin.length != 0) {
      this.socket.emit('friendRequest',{login: this.userLogin, from: JSON.parse(localStorage.getItem('login'))});
      this.socket.listen('messageFriendRequest').subscribe((data) => {
        this.message = data['message'];
      });
    }
  }

  ngOnInit(): void {
  }

}
