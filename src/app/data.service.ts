import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {timer} from "rxjs";
import {takeWhile, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from "@angular/router";
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  init = false;
  items = JSON.parse(localStorage.getItem('items'));
  history = JSON.parse(localStorage.getItem('history'));
  activeTextData = {
    name: '',
    id: '',
    time: 0,
    text: ''
  };
  time = 0;
  editMode = true;
  words: any;
  littersCount: number;
  activeLitters: number;
  statistics: any;
  counter = 0;
  err = 0;
  public loginValue = '';
  public passwordValue = '';
  errorsFormAuth = {
    login: '',
    password: '',
    api: ''
  };

  constructor(private router: Router ,private activatedRoute: ActivatedRoute, private api: ApiService ) { }

  isInit(): void {
    this.api.deleteHistory(`439cc7f9-7b70-4a90-a419-360c9056c000`);
    const items = localStorage.getItem('items');
    const history = localStorage.getItem('history');
    if (!history) {
      const historyStorage = [];
      localStorage.setItem('history', JSON.stringify(historyStorage));
    }
    if (!items) {
      const itemsStorage = [];
      localStorage.setItem('items', JSON.stringify(itemsStorage));
    }
    this.init = true;
  }

  setActiveData(id: string): void {
    this.activeTextData = JSON.parse(localStorage.getItem(id));
  }

  setTime(): void {
    localStorage.setItem(this.activeTextData.id, JSON.stringify(this.activeTextData));
  }
  setText(): void {
    localStorage.setItem(this.activeTextData.id, JSON.stringify(this.activeTextData));
  }

  start(time: number): void {
    this.counter = time;
    timer(1000, 1000)
      .pipe(
        takeWhile( () => this.counter > 0 ),
        tap(() => this.counter--)
      )
      .subscribe( () => {
        this.time = this.counter;
        if (this.time == 0) {
          this.editMode = true;
          if (this.router.url != '/statistics') {
            this.stopGame();
          }
        }
      } );
  }

  transformArray(): any {
    let litters: any;

    litters = this.activeTextData.text.split('');

    for (let i = 0; i < litters.length; i++) {
      litters[i] = {
        litter: litters[i],
        type: 'notWritten',
        stick: false
      };
    }
    this.littersCount = litters.length;
    this.activeLitters = 1;
    this.words = litters;
  }

  stopGame(): void {
    this.statistics = {
      time: this.activeTextData.time - this.counter,
      litterCount: this.activeLitters - 1,
      err: this.err
    };
    if (this.statistics.time == 0) {
      this.statistics.time = 1;
    }
    this.counter = 1;
    this.router.navigate(['/statistics']);
    this.setHistory(this.statistics);
  }

  getDate(): string {
    const newDate = new Date();
    let date: any;
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const Year = newDate.getFullYear();
    if (String(day).length == 1) {
      date = '0' + day + '.';
    } else {
      date = day + '.';
    }
    if (String(month).length == 1) {
      date += '0' + month + '.';
    } else {
      date += month + '.';
    }
    date += Year;
    return date;
  }

  setHistory(item: any): void {
    item.name = this.activeTextData.name;
    item.date =  this.getDate();
    item.id =  this.activeTextData.id;
    const history = JSON.parse(localStorage.getItem('history'));
    history.unshift(item);
    localStorage.setItem('history', JSON.stringify(history));
    this.history = JSON.parse(localStorage.getItem('history'));
  }

  deleteHistoryItem(index: any): void {
    const history = this.history;
    history.splice(index, 1);
    localStorage.setItem('history', JSON.stringify(history));
    this.history = JSON.parse(localStorage.getItem('history'));
  }

  createText(name: string): void {
    const text = {
      name: name,
      id: uuidv4(),
      text: '',
      time: 30
    };
    localStorage.setItem(text.id, JSON.stringify(text));
    const item = {
      name: name,
      id: text.id
    };
    const items = JSON.parse(localStorage.getItem('items'));
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
    this.items = JSON.parse(localStorage.getItem('items'));
    this.router.navigate(['/text/' + text.id]);
  }

  login() {
    this.api.login(this.loginValue, this.passwordValue).then(response => {

    });
    debugger
  }
  register(): void {

  }
}
