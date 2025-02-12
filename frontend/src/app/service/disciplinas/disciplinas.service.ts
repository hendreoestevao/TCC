import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisciplinasService {
  private apiUrl = 'http://localhost:8080/api/disciplinas';
  constructor(private http: HttpClient) { }

  getDisciplinas(): Observable<any[]> {
    // const token = localStorage.getItem('authToken'); // Obtém o token do localStorage
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(this.apiUrl, );
  }

  criarDisciplina(disciplina: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Obtém o token do localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.apiUrl, disciplina, { headers });
  }

  // Método para atualizar uma disciplina existente
  atualizarDisciplina(id: number, disciplina: any): Observable<any> {

    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('Token não encontrado!');
      throw new Error('Token de autenticação não encontrado.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`http://localhost:8080/api/disciplinas/${id}`, disciplina, { headers });
  }


  deletarDisciplina(id: number): Observable<any> {
    const token = localStorage.getItem('authToken'); // Obtém o token do localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
