import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  tabsFriends = 'friends';

  constructor(public router: Router, public svc: DataService, public activatedRoute: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
  }

  setTab(tab: string): void {
    const url = '/settings/' + tab;
    this.router.navigate([url]);
  }

  openText(index: any): void {
    const url = '/text/' + this.svc.history[index].idText;
    this.router.navigate([url]);
  }

  closeSettings(): void {
    if (this.svc.activeTextData.id != '') {
      this.router.navigate(['/text/' + this.svc.activeTextData.id]);
    } else {
      this.router.navigate(['/']);
    }
  }

  setTabsFriends(tab: string): void {
    this.tabsFriends = tab;
  }
}
