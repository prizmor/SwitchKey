import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";

@Component({
  selector: 'app-add-text',
  templateUrl: './add-text.component.html',
  styleUrls: ['./add-text.component.scss']
})
export class AddTextComponent implements OnInit {

  public value: string;

  constructor(public svc: DataService) { }

  ngOnInit(): void {

  }

  onClick(): void {
    if (this.value.length > 4) {
      this.svc.createText(this.value);
    }
  }

}
