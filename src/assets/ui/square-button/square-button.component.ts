import { Component, OnInit, Input } from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../../../app/data.service";

@Component({
  selector: 'app-square-button',
  templateUrl: './square-button.component.html',
  styleUrls: ['./square-button.component.scss']
})
export class SquareButtonComponent implements OnInit {

  constructor(private router: Router, public svc: DataService) {
  }

  ngOnInit(): void {
    const text = new String(this.text);
    this.text =  text[0];
  }



  @Input() text;
  @Input() id;
  @Input() type;
  @Input() icon;
  @Input() onClick;
  @Input() opacity;
}
