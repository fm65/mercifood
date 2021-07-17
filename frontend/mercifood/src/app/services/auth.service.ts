import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

login(username: string, password: string): Observable<any> {
  return this.http.post(API_URL + 'login', {
    username,
    password
  }, httpOptions);
}

register(firstname: string, lastname: string, username: string, email: string, password: string): Observable<any> {
  return this.http.post(API_URL + 'subscribe', {
    firstname,
    lastname,
    username,
    email,
    password
  }, httpOptions);
}
}
