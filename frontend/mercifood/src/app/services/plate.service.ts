import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/plates/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class PlateService {

  constructor(private http: HttpClient) { }

  share(name: string, quantity: number, comment:string, photo?:string): Observable<any> {
    return this.http.post(API_URL, {
      name,
      quantity,
      comment,
      photo
    }, httpOptions);
  }
}
