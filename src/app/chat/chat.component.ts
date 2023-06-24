import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {


  messages: string[] = [];
  newMessage: string = '';
  connectionId!: string | null;

  connection!: signalR.HubConnection;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7078/Hub/ChatHub')
      .build();

    this.connection.start()
      .then(() => {
        const connectionId = this.connection.connectionId;
        console.log('Mi connectionId:', connectionId);

        // Unirse al grupo "chatGroup"
        this.connection.invoke('JoinGroup', 'chatGroup')
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));

    // Escuchar los mensajes entrantes
    this.connection.on('ReceiveMessage', (message: string) => {
      console.log('Recibido desde el backend:', message);
    });

    // Cargar los mensajes existentes del grupo
    this.connection.on('LoadMessages', (messages: string[]) => {
      console.log('Cargando mensajes existentes:', messages);
      this.messages = messages;
    });

  }

  loadMessages() {
    this.http.get<string[]>('https://localhost:7078/chat').subscribe((response) => {
      this.messages = response;
    });
  }

  sendMessage() {
    this.connection.invoke('SendMessage', 'chatGroup', this.newMessage)
      .then(() => this.newMessage = '')
      .catch(error => console.error(error));
  }
}
