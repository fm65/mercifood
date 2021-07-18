import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/recipes/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }

  add(name: string, ingredient: number, note:string): Observable<any> {
    return this.http.post(API_URL, {
      name,
      ingredient,
      note
    }, httpOptions);
  }
}

