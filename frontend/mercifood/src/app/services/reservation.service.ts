import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationProps } from '../../../../../backend/api/mercifood/models/reservation.model';

const API_URL = 'http://localhost:3000/reservations';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post(API_URL, data, httpOptions);
  }

  getAll(): Observable<ReservationProps[]> {
    return this.http.get<ReservationProps[]>(API_URL);
  }

  getBy(by: any):Observable<any> {
    return this.http.get(`${API_URL}/${by}`);
  }

  update(id: any, plate: ReservationProps): Observable<any> {
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
