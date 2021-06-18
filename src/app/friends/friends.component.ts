import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  friends = false;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:click', ['$event.target.className'])
  onClick(e) {
    if (e != 'friendsList' && e != 'item' && e != 'friends' && e != '') {
      this.friends = false;
    }
  }

}
