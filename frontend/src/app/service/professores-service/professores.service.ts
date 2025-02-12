import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfessoresService {

  private apiUrl = 'http://localhost:8080/api/professores';

  constructor(private http: HttpClient) { }

  getProfessores(): Observable<any> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticação não encontrado!');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
  criarProfessor(professor: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticação não encontrado!');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    return this.http.post<any>(this.apiUrl, professor, { headers });
  }

  // Método para atualizar um professor
  getProfessorById(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    return this.http.get<any>(`${this.apiUrl}/p/${id}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }

  // Método para atualizar o professor
  updateProfessor(id: number, professorData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    return this.http.put<any>(`${this.apiUrl}/${id}`, professorData, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }

  deletarProfessor(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token de autenticação não encontrado!');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

}
