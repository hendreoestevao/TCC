import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  private apiUrl = 'http://localhost:8080/api/cursos';

  constructor(private http: HttpClient) { }

  // Método para obter os cursos
  getCursos(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.apiUrl, { headers });
  }

  // Método para atualizar um curso
  atualizarCurso(id: number, nome: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const body = { nome };

    // Cabeçalhos com o token de autorização
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(url, body, { headers });
  }

  // Método para criar um novo curso
  criarCurso(nome: string, token: string): Observable<any> {
    const body = { nome };

    // Cabeçalhos com o token de autorização
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(this.apiUrl, body, { headers });
  }


  deletarCurso(id: number, token: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }
}
