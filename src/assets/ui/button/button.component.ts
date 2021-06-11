import { Component, OnInit, Input } from '@angular/core';
import {DataService} from "../../../app/data.service";
import {timer} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  constructor(public svc: DataService, public router: Router) { }

  ngOnInit(): void {
    this.onClick = () => {
      return
    };
  }

  @Input() onClick;
  @Input() text;
  @Input() colorType;
  @Input() value;

}
