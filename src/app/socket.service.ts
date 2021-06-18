import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;
  readonly uri: string = 'ws://localhost:5000';
  socketConnection = true;

  constructor() {}

  connect(token: string) {
    if (token) {
      this.socket = io(this.uri, {
        reconnectionDelayMax: 10000,
        auth: {
          token: token
        },
      });
      this.socket.on("disconnect", (reason) => {
        this.socketConnection = false;
        console.error('disconnect');
      });
      this.socket.on("connect", (reason) => {
        this.socketConnection = true;
        console.error('connect');
      });
    }
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

}
