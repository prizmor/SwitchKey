import { Injectable } from '@angular/core';
import {timer} from "rxjs";
import {takeWhile, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from "@angular/router";
import { ApiService } from './api.service';
import {HttpErrorResponse} from "@angular/common/http";
import {SocketService} from "./socket.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  init = false;
  items = JSON.parse(localStorage.getItem('items'));
  history = JSON.parse(localStorage.getItem('history'));
  friends = [];
  message = [];
  friendRequests = [];
  blocked = [];
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
  public emailValue = '';
  profile: any = {
    online: false
  };
  errorsFormAuth = {
    login: '',
    password: '',
    email: '',
    api: ''
  };

  constructor(private router: Router ,private activatedRoute: ActivatedRoute, private api: ApiService, private ws: SocketService) { }

  isInit(): void {
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
    if (JSON.parse(localStorage.getItem('login')) == 'admin') {
      this.ws.emit('friendRequest', {login: 'prizmor', from: 'admin'});
    }
    this.ws.listen('message').subscribe(() => {
      this.getMessage();
      this.getFriendRequests();
      this.getFriends();
      this.getBlocked();
    });
    this.ws.listen('resetFriends').subscribe(() => {
      this.getFriends();
      this.getBlocked();
    });
    this.ws.listen('resetProfile').subscribe(() => {
      this.getProfile(JSON.parse(localStorage.getItem('login')));
    });
    this.initApp();
  }

  initApp(): void {
    this.api.getAllText().subscribe((res) => {
      localStorage.setItem('items', JSON.stringify(res));
      this.items = JSON.parse(localStorage.getItem('items'));
    });
    this.api.getHistory(1, 25).subscribe((res) => {
      if (res.items) {
        localStorage.setItem('history', JSON.stringify(res.items));
        this.history = JSON.parse(localStorage.getItem('history'));
      }
    });
    this.getFriends();
    this.getFriendRequests();
    this.getMessage();
    this.getBlocked();
  }

  setActiveData(id: string): void {
    const items = JSON.parse(localStorage.getItem('items'));
    this.api.getTextById(id).subscribe((res) => {
      this.activeTextData = res;
    });
    this.items = items;
  }

  editText(): void {
    this.api.editText(this.activeTextData.id, this.activeTextData.name, this.activeTextData.text, this.activeTextData.time).subscribe((res) => {
      this.api.getAllText().subscribe(resAllText => {
        localStorage.setItem('items', JSON.stringify(resAllText));
        this.items = JSON.parse(localStorage.getItem('items'));
      });
    });
  }

  start(time: number): void {
    if (this.activeTextData.text.length != 0) {
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

  deleteTextItem(id: string): void {
    this.api.deleteText(id).subscribe((res) => {
      this.api.getAllText().subscribe((res) => {
        localStorage.setItem('items', JSON.stringify(res));
        this.items = JSON.parse(localStorage.getItem('items'));
      });
    });
  }

  setHistory(item: any): void {
    this.api.addHistory(this.activeTextData.name, item.err, item.time, item.litterCount, this.activeTextData.id).subscribe((res) => {
      this.api.getHistory(1, 25).subscribe((res) => {
        localStorage.setItem('history', JSON.stringify(res.items));
        this.history = JSON.parse(localStorage.getItem('history'));
      });
    });
  }

  deleteHistoryItem(id: any): void {
    this.api.deleteHistory(id).subscribe((res) => {
      this.api.getHistory(1, 25).subscribe((res) => {
        if (res.items == undefined) {
          localStorage.setItem('history', JSON.stringify([]));
          this.history = JSON.parse(localStorage.getItem('history'));
        } else {
          localStorage.setItem('history', JSON.stringify(res.items));
          this.history = JSON.parse(localStorage.getItem('history'));
        }
      });
    });
  }

  createText(name: string): void {
    this.api.addText(name).subscribe(res => {
      this.api.getAllText().subscribe(resAllText => {
        localStorage.setItem('items', JSON.stringify(resAllText));
        this.items = JSON.parse(localStorage.getItem('items'));
        this.router.navigate(['text/' + res.id]);
      });
    });
  }

  getProfile(login: string): void {
    this.api.getProfile(login).subscribe(data => {
      this.profile = data.profile;
    });
  }


  login() {
    const errors = (data) => {
      this.errorsFormAuth.api = data.error.message;
    };
    this.api.login(this.loginValue, this.passwordValue, errors).subscribe((res) => {
      this.api.saveToken(res.token);
      localStorage.setItem('login', JSON.stringify(res.login));
      this.api.updateOptions();
      this.isInit();
      this.router.navigate(['/']);
      this.ws.connect(res.token);
    },(err:HttpErrorResponse)=>{
      errors(err);
    });
  }
  register(): void {
    const errors = (data) => {
      this.errorsFormAuth.api = data.error.message;
    };
    this.api.register(this.loginValue, this.passwordValue, this.emailValue, errors);
  }

  getFriends(): void {
    this.api.getFriends().subscribe(res => {
      this.friends = res.friends;
    });
  }

  getFriendRequests(): void {
    this.api.getFriendRequests().subscribe(res => {
      this.friendRequests = res.friendRequests;
    });
  }

  getMessage(): void {
    this.api.getMessage().subscribe(res => {
      this.message = res.message;
    });
  }

  getBlocked(): void {
    this.api.getBlockedUser().subscribe(res => {
      this.blocked = res.blocked;
    });
  }
}
