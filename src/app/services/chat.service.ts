import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private connection!: signalR.HubConnection;
  private connectionId!: string | null;

  constructor() { }

  startConnection(): Promise<void> {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7078/Hub/ChatHub')
      .build();

    return this.connection.start()
      .then(() => {
        this.connectionId = this.connection.connectionId;
      })
      .catch(error => console.error(error));
  }

  public joinGroup(groupName: string): Promise<string[]> {
    return this.connection.invoke('JoinGroupChat', groupName);
  }

  public sendMessage(groupName: string, message: string): Promise<string[]> {
    return this.connection.invoke('SendMessageChat', groupName, message);
  }

  public deleteGroupMessages(groupName: string): Promise<string[]> {
    return this.connection.invoke('DeleteGroupMessagesChat', groupName);
  }

  public onReceiveMessage(callback: (messages: string[]) => void): void {
    this.connection.on('ReceiveMessage', callback);
  }

  public onLoadMessages(callback: (messages: string[]) => void): void {
    this.connection.on('LoadMessages', callback);
  }


  getConnectionId(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (this.connectionId) {
        resolve(this.connectionId);
      } else {
        reject(new Error('Connection not established'));
      }
    });
  }



}
