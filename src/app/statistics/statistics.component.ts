import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  constructor(public router: Router ,private activatedRoute: ActivatedRoute, public svc: DataService) {

  }

  ngOnInit(): void {
  }

  onClick(): void {
    this.router.navigate(['text/' + this.svc.activeTextData.id]);
  }

}
