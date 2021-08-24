import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageProps } from '../../../../../backend/api/mercifood/models/message.model';

const API_URL = 'http://localhost:3000/messages';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(API_URL, data, httpOptions);
  }

  getAll(): Observable<MessageProps[]> {
    return this.http.get<MessageProps[]>(API_URL);
  }

  getBy(by: any):Observable<any> {
    return this.http.get(`${API_URL}/${by}`);
  }
}
