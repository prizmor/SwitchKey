import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:5000/api';
  options = {headers: {'Content-Type':'application/json; charset=utf-8', 'Authorization':'bearer ' + this.token()}};

  constructor(private http: HttpClient, private router: Router) { }

  saveToken(token: string): void {
    localStorage.setItem('token', JSON.stringify(token));
  }
  token(): string {
    return JSON.parse(localStorage.getItem('token'));
  }
  updateOptions(): any {
    this.options = {headers: {'Content-Type':'application/json; charset=utf-8', 'Authorization':'bearer ' + JSON.parse(localStorage.getItem('token'))}};
  }

  register(login: string, password: string, email: string, errors): any {
    this.http.post<any>(this.baseUrl + '/register', { login, password, email }, {headers: {'Content-Type':'application/json; charset=utf-8'}}).subscribe(res => {
      this.router.navigate(['auth/login']);
    },(err:HttpErrorResponse)=>{
      errors(err);
    });
  }

  login(login: string, password: string, errors): any {
    return this.http.post<any>(this.baseUrl + '/login', { login, password }, {headers: {'Content-Type':'application/json; charset=utf-8'}})
  }

  getAllText(): any {
    /*this.http.get<any>(this.baseUrl + `/text`, this.options).subscribe((res) => {
      localStorage.setItem('items', JSON.stringify(res));
      if (id) {
        this.router.navigate(['/text/' + id]);
      }
    });*/
    return this.http.get<any>(this.baseUrl + `/text`, this.options);
  }

  getTextById(id: string): any {
    return this.http.get<any>(this.baseUrl + `/text/${id}`, this.options);
  }

  editText( id: string, name: string, text: string, time: number): any {
    return this.http.put<any>(this.baseUrl + `/text`, {id, name, text, time}, this.options);
  }

  deleteText( id: string): any {
    return this.http.delete<any>(this.baseUrl + `/text/${id}`, this.options);
  }

  addText(name: string): any {
    return  this.http.post<any>(this.baseUrl + `/text`, {name}, this.options);
  }

  getHistory(page: number, size: number): any {
    return this.http.get<any>(this.baseUrl + `/history?page=${page}&size=${size}`, this.options);
  }

  addHistory(name: string, err: number, time: number, litters: number, idText: any): any {
    return this.http.post<any>(this.baseUrl + `/history`, {name, err, time, litters, idText}, this.options);
  }

  deleteHistory(id: string): any {
    return this.http.delete<any>(this.baseUrl + `/history/${id}`, this.options);
  }

  getFriends(): any {
    return this.http.get<any>(this.baseUrl + `/friends`, this.options);
  }

  getFriendRequests(): any {
    return this.http.get<any>(this.baseUrl + `/friendRequests`, this.options);
  }

  getMessage(): any {
    return this.http.get<any>(this.baseUrl + `/message`, this.options);
  }
}
