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

  groupName!: string;

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
        
      })
      .catch(error => console.error(error));

    // Escuchar los mensajes entrantes
    this.connection.on('ReceiveMessage', (messages: string[]) => {
      console.log('Recibido desde el backend:', messages);
      this.messages = messages;
    });

    // Cargar los mensajes existentes del grupo
    this.connection.on('LoadMessages', (messages: string[]) => {
      console.log('Cargando mensajes existentes:', messages);
      this.messages = messages;
    });

  }


  connectGroup(){
    this.connection.invoke('JoinGroup', this.groupName)
        .then()
        .catch(error => console.error(error));
  }


  sendMessage() {
    this.connection.invoke('SendMessage', this.groupName, this.newMessage)
      .then(() => this.newMessage = '')
      .catch(error => console.error(error));
  }


  onDeleteGroupMessages() {
    const groupName = this.groupName; // Reemplaza 'nombre-del-grupo' con el nombre de tu grupo
    this.connection.invoke('DeleteGroupMessages', groupName)
      .catch(error => console.error(error));
  }
}
