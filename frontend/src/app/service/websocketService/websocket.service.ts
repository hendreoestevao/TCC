import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private socket!: WebSocket;
  private messagesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  private reconnectAttempts = 0;  // Contador de tentativas de reconexão
  private maxReconnectAttempts = 5; // Limite de tentativas de reconexão

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket('ws://localhost:8080/chat');


    this.socket.onopen = () => {
      this.reconnectAttempts = 0; // Reseta as tentativas ao conectar com sucesso
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.onMessageReceived(message);
      } catch (error) {
      }
    };

    this.socket.onerror = (error) => {
      this.handleError();
    };

    this.socket.onclose = (event) => {
      this.handleError();
    };
  }

  private handleError(): void {
    if (this.socket.readyState === WebSocket.CLOSING || this.socket.readyState === WebSocket.CLOSED) {
      this.reconnect();
    }
  }

  private reconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Backoff exponencial
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    } else {
    }
  }

  private onMessageReceived(message: any): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  sendMessage(message: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.close(); // Fechar o WebSocket quando o serviço for destruído
    }
  }
}
