import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  groupName!: string;

  newMessage: string = '';


  constructor(private chatService: ChatService) { }

  connectGroup() {
    this.chatService.joinGroup(this.groupName)
      .catch(error => console.error(error));
  }
}
