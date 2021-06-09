import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public router: Router, public svc: DataService) {
  }

  ngOnInit(): void {
  }

  openText(index: any): void {
    this.router.navigate(['/text/' + this.svc.history[index].id]);
  }

  closeSettings(): void {
    if (this.svc.activeTextData.id != '') {
      this.router.navigate(['/text/' + this.svc.activeTextData.id]);
    } else {
      this.router.navigate(['/']);
    }
  }

}
