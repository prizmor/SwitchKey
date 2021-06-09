import { Component, OnInit, HostListener} from '@angular/core';
import {DataService} from "../data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-start-display',
  templateUrl: './start-display.component.html',
  styleUrls: ['./start-display.component.scss']
})

export class StartDisplayComponent implements OnInit {

  init: boolean;

  constructor(public svc: DataService, public router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.svc.isInit();
      this.init = this.svc.init;
    }, 3000);
  }


  @HostListener('document:keydown.space', ['$event'])
  space(): void {
    if (this.init) {
      this.router.navigateByUrl('/');
    }
  }

}
