import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversasService {
  private apiUrl = 'http://localhost:8080/api/messages';  // URL da API

  constructor(private http: HttpClient) { }

  // Método para enviar uma mensagem
  enviarMensagem(content: string, studentId: number, teacherId: number, timestamp: string, role: string): Observable<any> {
    const body = {
      content,
      studentId,
      teacherId,
      timestamp,
      role
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, body, { headers });
  }

  buscarConversas(studentId: number, teacherId: number): Observable<any> {
    const url = `${this.apiUrl}?studentId=${studentId}&teacherId=${teacherId}`;
    return this.http.get(url);
  }

  buscarConversasByProfessor(teacherId: number): Observable<any> {
    const url = `http://localhost:8080/api/messages/teacher/${teacherId}`;
    return this.http.get(url);
  }
}
