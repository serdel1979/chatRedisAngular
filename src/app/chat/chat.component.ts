import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { ChatService } from '../services/chat.service';

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

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.startConnection()
      .then(() => {
        this.chatService.getConnectionId()
          .then(connectionId => {
            console.log('Mi connectionId:', connectionId);
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));

    // Cargar los mensajes existentes del grupo
    this.chatService.onLoadMessages((messages: string[]) => {
      this.messages = messages;
    });

    this.chatService.onReceiveMessage((messages: string[]) => {
      this.messages = messages;
    });

  }


  connectGroup() {
    this.chatService.joinGroup(this.groupName)
      .catch(error => console.error(error));
  }


  sendMessage() {
    this.chatService.sendMessage(this.groupName, this.newMessage)
      .then(() => {
        this.newMessage = ''
      })
      .catch(error => console.error(error));
  }


  onDeleteGroupMessages() {
    this.chatService.deleteGroupMessages(this.groupName)
      .then((msjs) => this.messages = msjs)
      .catch((err) => console.error(err));
  }
}
