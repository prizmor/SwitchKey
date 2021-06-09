import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-void',
  templateUrl: './void.component.html',
  styleUrls: ['./void.component.scss']
})
export class VoidComponent implements OnInit {

  constructor(public router: Router,  public svc: DataService) { }

  ngOnInit(): void {

  }

}
