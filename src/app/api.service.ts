import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:5000/api';
  options = {headers: {'Content-Type':'application/json; charset=utf-8', 'Authorization':'bearer ' + this.token()}};

  constructor(private http: HttpClient) { }

  saveToken(token: string): void {
    localStorage.setItem('token', JSON.stringify(token));
  }
  token(): string {
    return JSON.parse(localStorage.getItem('token'));
  }

  register(login: string, password: string): any {
    this.http.post<any>(this.baseUrl + '/register', { login, password }, {headers: {'Content-Type':'application/json; charset=utf-8'}}).subscribe(res => {
      if (res.message == 'OK') {
        return true;
      } else {
        return false;
      }
    });
  }

  login(login: string, password: string): any {
    return this.http.post<any>(this.baseUrl + '/login', { login, password }, {headers: {'Content-Type':'application/json; charset=utf-8'}}).subscribe((res) => {
      this.saveToken(res.token);
    });
  }

  getAllText(): any {
    this.http.get<any>(this.baseUrl + `/text`, this.options).subscribe((res) => {
      return res;
    });
  }

  getTextById(id: string): any {
    this.http.get<any>(this.baseUrl + `/text/${id}`, this.options).subscribe((res) => {
      return res;
    });
  }

  editText( id: string, name: string, text: string, time: number): any {
    this.http.put<any>(this.baseUrl + `/text`, {id, name, text, time}, this.options).subscribe((res) => {
      return res;
    });
  }

  deleteText( id: string): any {
    this.http.delete<any>(this.baseUrl + `/text/${id}`, this.options).subscribe((res) => {
      return res;
    });
  }

  addText(name: string): any {
    this.http.post<any>(this.baseUrl + `/text`, {name}, this.options).subscribe((res) => {
      return res;
    });
  }

  getHistory(page: number, size: number): any {
    this.http.get<any>(this.baseUrl + `/history?page=${page}&size=${size}`, this.options).subscribe((res) => {
      return res;
    });
  }

  addHistory(name: string, err: number, time: number, litters: number, idText: any): any {
    this.http.post<any>(this.baseUrl + `/history`, {name, err, time, litters ,idText}, this.options).subscribe((res) => {
      return res;
    });
  }

  deleteHistory(id: string): void {
    this.http.delete<any>(this.baseUrl + `/history/${id}`, this.options).subscribe((res) => {
      return res;
    });
  }
}
