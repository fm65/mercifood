import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlateProps } from '../../../../../backend/api/mercifood/models/plate.model';

const API_URL = 'http://localhost:3000/plates';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class PlateService {

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(API_URL, data, httpOptions);
  }

  getAll(): Observable<PlateProps[]> {
    return this.http.get<PlateProps[]>(API_URL);
  }

  getBy(by: any):Observable<any> {
    return this.http.get(`${API_URL}/${by}`);
  }

  update(id: any, plate: PlateProps): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, plate);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(API_URL);
  }

  delete(by: any): Observable<any> {
    console.log(`${API_URL}/${by}`);
    return this.http.delete(`${API_URL}/${by}`);
  }
}
