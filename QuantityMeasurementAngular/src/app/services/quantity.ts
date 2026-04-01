import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuantityInputDTO {
  value1: number;
  unit1: string;
  value2?: number;
  unit2?: string;
  targetUnit?: string;
  operation: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuantityService {
  private baseUrl = 'http://localhost:8080/api/v1/quantities';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  compare(data: QuantityInputDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/compare`, data, {
      headers: this.getHeaders(),
    });
  }

  convert(data: QuantityInputDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/convert`, data, {
      headers: this.getHeaders(),
    });
  }

  add(data: QuantityInputDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, data, {
      headers: this.getHeaders(),
    });
  }

  subtract(data: QuantityInputDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/subtract`, data, {
      headers: this.getHeaders(),
    });
  }

  divide(data: QuantityInputDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/divide`, data, {
      headers: this.getHeaders(),
    });
  }
}