import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  @Input() value;
  @Output() valueChange = new EventEmitter<string>();

  onChangeInput(event): void {
    this.valueChange.emit(event.target.value);
  }
}
