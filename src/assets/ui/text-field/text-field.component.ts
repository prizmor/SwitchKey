import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DataService} from "../../../app/data.service";

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements OnInit {

  constructor(public svc: DataService) {
  }

  ngOnInit(): void {
  }

  @Input() placeholder;
  @Input() value;
  @Output() valueChange = new EventEmitter<string>();

  onChangeInput(event): void {
    this.valueChange.emit(event.target.value);
  }
}
