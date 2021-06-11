import { Component, HostListener, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "./data.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  textName = '';

  constructor(public router: Router, public svc: DataService) {
  }

  ngOnInit(): void {

    if (localStorage.getItem('token')) {
      this.router.navigate(['/start']);
    } else {
      this.router.navigate(['/auth']);
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
    this.router.navigate(['/settings']);
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

