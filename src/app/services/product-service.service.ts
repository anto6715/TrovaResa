import { Injectable } from '@angular/core';
import {ServerUrlMySql} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../models/product';

const headerDict = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const requestOptions = {
  headers: new HttpHeaders(headerDict),
  withCredentials: true
};

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};
@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  apiUrlMysql = `${ServerUrlMySql.url}/product`;

  constructor(public http: HttpClient) { }

  getAll(): Observable<Product[]> {
    let request = this.http.get<Product[]>(this.apiUrlMysql+ "/getAll");
    return request;
  }

  getById(id: number): Observable<Product> {
    let request = this.http.get<Product>(this.apiUrlMysql+ "/getById/"+id);
    return request;
  }

  save(persona: Product): Observable<Product> {
    let request = this.http.post<Product>(this.apiUrlMysql + "/save", persona);
    return request;
  }

  update(persona: Product): Observable<Product> {
    let request = this.http.post<Product>(this.apiUrlMysql + "/update", persona);
    return request;
  }

  delete(id: number): Observable<Product> {
    let request = this.http.get<Product>(this.apiUrlMysql+ "/deleteById/"+id);
    return request;
  }
}
