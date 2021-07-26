import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserProps } from '../../../../../backend/api/mercifood/models/user.model';

const API_URL = 'http://localhost:3000/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + '/all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + '/user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + '/mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + '/admin', { responseType: 'text' });
  }

  getAll(): Observable<UserProps[]> {
    return this.http.get<UserProps[]>(API_URL);
  }

  getBy(by: any): Observable<any> {
    return this.http.get(`${API_URL}/${by}`);
  }

  create(user: UserProps): Observable<any> {
    return this.http.post(API_URL, user);
  }

  update(user: UserProps): Observable<any> {
    return this.http.put(`${API_URL}/${user.id}`, user);
  }

  delete(by: any): Observable<any> {
    return this.http.delete(`${API_URL}/${by}`);
  }

}
