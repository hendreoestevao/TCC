import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurmasService {
  private apiUrl = 'http://localhost:8080/api/turmas';

  constructor(private http: HttpClient) {}

  getTurmas(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(this.apiUrl, { headers });
  }

  createTurma(data: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, data, { headers });
  }

  updateTurma(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(`${this.apiUrl}/${id}`, data, { headers });
  }

  deletarTurma(id: number): Observable<void> {
    const token = localStorage.getItem('authToken'); // Obtém o token do localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Faz a requisição DELETE para a API
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }


}
