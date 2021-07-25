import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlateProps } from '../../../../../backend/api/mercifood/models/plate.model';

const API_URL = 'http://localhost:3000/plates';

const httpOptions = {
  // headers: new HttpHeaders({
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Headers': 'Content-Type',
  //   'Content-Type': 'application/json',
  //   "Authorization": "Bearer " + "kjl" ,
  // })
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })

}
console.log(httpOptions["authorization"])
@Injectable({
  providedIn: 'root'
})
export class PlateService {

  constructor(private http: HttpClient) { }

  share(name: string, quantity: number,
        number:number, comment:string,
        photo?:string): Observable<any> {
    return this.http.post(API_URL, {
      name,
      quantity,
      number,
      photo,
      comment,
    }, httpOptions);
  }


  /*getAll(): Observable<PlateProps[]> {
    return this.http.get<PlateProps[]>(API_URL);
  }*/
}
